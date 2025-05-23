import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { Employee } from "../OrganizationStructure";
import ProjectsTable from "./ProjectsTable";

interface MembersTableProps {
  members: Employee[];
}

const MembersTable = ({ members }: MembersTableProps) => {
  const [expandedProjects, setExpandedProjects] =
    useState<DataTableExpandedRows>({});

  const handleRowToggle = (e: { data: DataTableExpandedRows }) => {
    if (e.data && !Array.isArray(e.data)) {
      setExpandedProjects(e.data);
    }
  };

  return (
    <DataTable
      value={members}
      dataKey="employee_id"
      expandedRows={expandedProjects}
      onRowToggle={handleRowToggle}
      rowExpansionTemplate={(employee: Employee) => (
        <div className="p-3">
          <ProjectsTable projects={employee.projects} />
        </div>
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
