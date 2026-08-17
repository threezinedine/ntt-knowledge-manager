from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.middleware import require_login
from server.features.todos.model import PeriodType
from server.features.todos.schemas import PeriodTypeCreate, PeriodTypeRead, PeriodTypeUpdate

router = APIRouter(
    prefix="/todos/period-types",
    tags=["todos"],
    dependencies=[Depends(require_login)],
)

VALID_KINDS = {"interval", "weekly"}


def _to_dict(p: PeriodType) -> dict:
    return {
        "id": p.id,
        "name": p.name,
        "kind": p.kind,
        "interval_days": p.interval_days,
        "days_of_week": p.days_of_week,
        "times_per_occurrence": p.times_per_occurrence,
        "is_custom": p.is_custom,
        "created_at": p.created_at,
        "updated_at": p.updated_at,
    }


def _get_or_404(db: Session, period_type_id: int) -> PeriodType:
    pt = db.get(PeriodType, period_type_id)
    if not pt:
        raise HTTPException(status_code=404, detail="Period type not found")
    return pt


def _validate(kind: str | None, interval_days: int | None, days_of_week: list[int] | None) -> None:
    if kind is not None and kind not in VALID_KINDS:
        raise HTTPException(status_code=422, detail=f"kind must be one of {VALID_KINDS}")
    if kind == "interval" and interval_days is None:
        raise HTTPException(status_code=422, detail="interval_days is required for kind=interval")
    if kind == "weekly" and not days_of_week:
        raise HTTPException(status_code=422, detail="days_of_week is required for kind=weekly")


@router.get("", response_model=list[PeriodTypeRead])
def list_period_types(db: Session = Depends(get_db)) -> list[dict]:
    rows = db.scalars(select(PeriodType).order_by(PeriodType.id)).all()
    return [_to_dict(p) for p in rows]


@router.post("", response_model=PeriodTypeRead, status_code=201)
def create_period_type(body: PeriodTypeCreate, db: Session = Depends(get_db)) -> dict:
    _validate(body.kind, body.interval_days, body.days_of_week)
    pt = PeriodType(
        name=body.name,
        kind=body.kind,
        interval_days=body.interval_days,
        days_of_week=body.days_of_week,
        times_per_occurrence=body.times_per_occurrence,
        is_custom=True,
    )
    db.add(pt)
    db.commit()
    db.refresh(pt)
    return _to_dict(pt)


@router.get("/{period_type_id}", response_model=PeriodTypeRead)
def get_period_type(period_type_id: int, db: Session = Depends(get_db)) -> dict:
    return _to_dict(_get_or_404(db, period_type_id))


@router.patch("/{period_type_id}", response_model=PeriodTypeRead)
def update_period_type(
    period_type_id: int, body: PeriodTypeUpdate, db: Session = Depends(get_db)
) -> dict:
    pt = _get_or_404(db, period_type_id)
    data = body.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(pt, field, value)
    _validate(pt.kind, pt.interval_days, pt.days_of_week)
    db.commit()
    db.refresh(pt)
    return _to_dict(pt)


@router.delete("/{period_type_id}", status_code=204)
def delete_period_type(period_type_id: int, db: Session = Depends(get_db)) -> None:
    pt = _get_or_404(db, period_type_id)
    db.delete(pt)
    db.commit()
