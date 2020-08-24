# pylint: disable=invalid-name
"""Election.audit_type

Revision ID: 9ed660c31c0a
Revises: 22c615fe67ab
Create Date: 2020-08-04 23:59:35.410239+00:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9ed660c31c0a"
down_revision = "22c615fe67ab"
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column("election", "election_date")
    op.drop_column("election", "election_type")
    op.drop_column("election", "meeting_date")

    audit_type_enum = sa.dialects.postgresql.ENUM(
        "BALLOT_POLLING", "BATCH_COMPARISON", name="audittype"
    )
    audit_type_enum.create(op.get_bind())
    op.add_column(
        "election", sa.Column("audit_type", audit_type_enum),
    )
    op.execute(
        """
        UPDATE election
        SET audit_type = 'BALLOT_POLLING'
        """
    )
    op.alter_column("election", "audit_type", nullable=False)


def downgrade():  # pragma: no cover
    pass
    # ### commands auto generated by Alembic - please adjust! ###
    # op.drop_column('election', 'audit_type')
    # ### end Alembic commands ###
