from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.db.deps import get_current_user
from app.db.session import get_db
from app.models.playlist import Playlist, PlaylistTrack
from app.models.track import Track
from app.models.user import User
from app.schemas.playlist import PlaylistCreate, PlaylistDetail, PlaylistOut, PlaylistTrackAdd
from app.schemas.track import TrackOut

router = APIRouter()


@router.post("/", response_model=PlaylistOut, status_code=status.HTTP_201_CREATED)
def create_playlist(
    payload: PlaylistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    playlist = Playlist(user_id=current_user.id, name=payload.name)
    db.add(playlist)
    db.commit()
    db.refresh(playlist)
    return playlist


@router.get("/", response_model=list[PlaylistOut])
def list_playlists(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Playlist)
        .filter(Playlist.user_id == current_user.id)
        .order_by(Playlist.id.asc())
        .all()
    )


@router.get("/{playlist_id}", response_model=PlaylistDetail)
def get_playlist(
    playlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    playlist = (
        db.query(Playlist)
        .options(joinedload(Playlist.items).joinedload(PlaylistTrack.track))
        .filter(Playlist.id == playlist_id, Playlist.user_id == current_user.id)
        .first()
    )
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")

    return PlaylistDetail(
        id=playlist.id,
        user_id=playlist.user_id,
        name=playlist.name,
        tracks=[TrackOut.model_validate(item.track) for item in playlist.items],
    )


@router.post("/{playlist_id}/tracks", status_code=status.HTTP_201_CREATED)
def add_track_to_playlist(
    playlist_id: int,
    payload: PlaylistTrackAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    playlist = (
        db.query(Playlist)
        .filter(Playlist.id == playlist_id, Playlist.user_id == current_user.id)
        .first()
    )
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")

    track = db.query(Track).filter(Track.id == payload.track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")

    existing = (
        db.query(PlaylistTrack)
        .filter(
            PlaylistTrack.playlist_id == playlist_id,
            PlaylistTrack.track_id == payload.track_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Track already in playlist")

    item = PlaylistTrack(playlist_id=playlist_id, track_id=payload.track_id)
    db.add(item)
    db.commit()

    return {"status": "ok"}


@router.delete("/{playlist_id}/tracks/{track_id}")
def remove_track_from_playlist(
    playlist_id: int,
    track_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    playlist = (
        db.query(Playlist)
        .filter(Playlist.id == playlist_id, Playlist.user_id == current_user.id)
        .first()
    )
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")

    item = (
        db.query(PlaylistTrack)
        .filter(
            PlaylistTrack.playlist_id == playlist_id,
            PlaylistTrack.track_id == track_id,
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Track not found in playlist")

    db.delete(item)
    db.commit()
    return {"status": "ok"}