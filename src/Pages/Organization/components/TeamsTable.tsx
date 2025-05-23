import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { ProgressBar } from "primereact/progressbar";
import { Team } from "../OrganizationStructure";
import MembersTable from "./MembersTable";

interface TeamsTableProps {
  teams: Team[];
  expandedRows: DataTableExpandedRows;
  onRowToggle: (e: { data: DataTableExpandedRows }) => void;
}

const TeamsTable = ({ teams, expandedRows, onRowToggle }: TeamsTableProps) => {
  return (
    <DataTable
      value={teams}
      dataKey="team_id"
      expandedRows={expandedRows}
      onRowToggle={onRowToggle}
      rowExpansionTemplate={(team: Team) => (
        <MembersTable members={team.members} />
      )}
    >
      <Column expander style={{ width: "3rem" }} />
      <Column field="team_id" header="Team ID" />
      <Column
        header="Member Count"
        body={(team: Team) => team.members.length}
      />
      <Column
        header="Budget Utilization"
        body={(team: Team) => (
          <ProgressBar
            value={(team.budget / 500000) * 100}
            showValue={false}
            style={{ height: "10px" }}
          />
        )}
      />
    </DataTable>
  );
};

export default TeamsTable;
