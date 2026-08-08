from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, or_, select
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.middleware import require_login
from server.features.node.model import Node, NodeRelation
from server.features.node.schemas import (
    NodeCreate,
    NodeRead,
    NodeUpdate,
    RelationCreate,
    RelationRead,
    RelationUpdate,
)

router = APIRouter(
    prefix="/nodes",
    tags=["nodes"],
    dependencies=[Depends(require_login)],
)


def node_to_dict(node: Node) -> dict[str, object]:
    return {
        "id": node.id,
        "title": node.title,
        "node_type": node.node_type,
        "content": node.content,
        "metadata": node.meta,
        "created_at": node.created_at,
        "updated_at": node.updated_at,
    }


def relation_to_dict(relation: NodeRelation) -> dict[str, object]:
    return {
        "id": relation.id,
        "source_node_id": relation.source_node_id,
        "target_node_id": relation.target_node_id,
        "relation_type": relation.relation_type,
        "metadata": relation.meta,
        "created_at": relation.created_at,
    }


def get_node_or_404(db: Session, node_id: int) -> Node:
    node = db.get(Node, node_id)
    if node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    return node


def get_relation_or_404(db: Session, relation_id: int) -> NodeRelation:
    relation = db.get(NodeRelation, relation_id)
    if relation is None:
        raise HTTPException(status_code=404, detail="Relation not found")
    return relation


@router.get("", response_model=list[NodeRead])
def list_nodes(db: Session = Depends(get_db)) -> list[dict[str, object]]:
    nodes = db.scalars(select(Node).order_by(Node.id)).all()
    return [node_to_dict(node) for node in nodes]


@router.post("", response_model=NodeRead, status_code=201)
def create_node(
    payload: NodeCreate, db: Session = Depends(get_db)
) -> dict[str, object]:
    node = Node(
        title=payload.title,
        node_type=payload.node_type,
        content=payload.content,
        meta=payload.metadata,
    )
    db.add(node)
    db.commit()
    db.refresh(node)
    return node_to_dict(node)


@router.get("/{node_id}", response_model=NodeRead)
def get_node(node_id: int, db: Session = Depends(get_db)) -> dict[str, object]:
    return node_to_dict(get_node_or_404(db, node_id))


@router.patch("/{node_id}", response_model=NodeRead)
def update_node(
    node_id: int, payload: NodeUpdate, db: Session = Depends(get_db)
) -> dict[str, object]:
    node = get_node_or_404(db, node_id)

    if payload.title is not None:
        node.title = payload.title
    if payload.node_type is not None:
        node.node_type = payload.node_type
    if payload.content is not None:
        node.content = payload.content
    if payload.metadata is not None:
        node.meta = payload.metadata

    db.commit()
    db.refresh(node)
    return node_to_dict(node)


@router.delete("/{node_id}", status_code=204)
def delete_node(node_id: int, db: Session = Depends(get_db)) -> None:
    node = get_node_or_404(db, node_id)
    # manually cascade: remove relations touching the node in either direction
    db.execute(
        delete(NodeRelation).where(
            or_(
                NodeRelation.source_node_id == node_id,
                NodeRelation.target_node_id == node_id,
            )
        )
    )
    db.delete(node)
    db.commit()


@router.get("/{node_id}/relations", response_model=list[RelationRead])
def list_node_relations(
    node_id: int, db: Session = Depends(get_db)
) -> list[dict[str, object]]:
    get_node_or_404(db, node_id)
    relations = db.scalars(
        select(NodeRelation)
        .where(
            or_(
                NodeRelation.source_node_id == node_id,
                NodeRelation.target_node_id == node_id,
            )
        )
        .order_by(NodeRelation.id)
    ).all()
    return [relation_to_dict(relation) for relation in relations]


@router.post("/{node_id}/relations", response_model=RelationRead, status_code=201)
def create_node_relation(
    node_id: int, payload: RelationCreate, db: Session = Depends(get_db)
) -> dict[str, object]:
    get_node_or_404(db, node_id)
    if payload.target_node_id == node_id:
        raise HTTPException(status_code=400, detail="A node cannot link to itself")
    get_node_or_404(db, payload.target_node_id)

    relation = NodeRelation(
        source_node_id=node_id,
        target_node_id=payload.target_node_id,
        relation_type=payload.relation_type,
        meta=payload.metadata,
    )
    db.add(relation)
    db.commit()
    db.refresh(relation)
    return relation_to_dict(relation)


@router.get("/relations/{relation_id}", response_model=RelationRead)
def get_relation(relation_id: int, db: Session = Depends(get_db)) -> dict[str, object]:
    return relation_to_dict(get_relation_or_404(db, relation_id))


@router.patch("/relations/{relation_id}", response_model=RelationRead)
def update_relation(
    relation_id: int, payload: RelationUpdate, db: Session = Depends(get_db)
) -> dict[str, object]:
    relation = get_relation_or_404(db, relation_id)

    if payload.relation_type is not None:
        relation.relation_type = payload.relation_type
    if payload.metadata is not None:
        relation.meta = payload.metadata

    db.commit()
    db.refresh(relation)
    return relation_to_dict(relation)


@router.delete("/relations/{relation_id}", status_code=204)
def delete_relation(relation_id: int, db: Session = Depends(get_db)) -> None:
    relation = get_relation_or_404(db, relation_id)
    db.delete(relation)
    db.commit()
