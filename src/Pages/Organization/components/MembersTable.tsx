import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { Employee } from "../OrganizationStructure";
import ProjectsTable from "./ProjectsTable";

interface MembersTableProps {
  members: Employee[];
}

const MembersTable = ({ members }: MembersTableProps) => {
  return (
    <DataTable
      value={members}
      dataKey="employee_id"
      rowExpansionTemplate={(employee: Employee) => (
        <ProjectsTable projects={employee.projects} />
      )}
    >
      <Column expander style={{ width: "3rem" }} />
      <Column field="name" header="Name" />
      <Column field="role" header="Role" />
      <Column
        header="Skills"
        body={(employee: Employee) => (
          <div className="flex gap-1">
            {employee.skills.map((skill) => (
              <Tag value={skill} key={skill} />
            ))}
          </div>
        )}
      />
    </DataTable>
  );
};

export default MembersTable;
