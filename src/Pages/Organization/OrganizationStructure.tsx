import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { useEffect, useMemo, useState } from "react";
import TeamsTable from "./components/TeamsTable";

// --- Interfaces ---
export interface Project {
  project_id: string;
  name: string;
  status: "Behind Schedule" | "On Track" | "Completed";
  completion: number;
}

export interface Employee {
  employee_id: string;
  name: string;
  role: string;
  skills: string[];
  projects: Project[];
}

export interface Team {
  team_id: string;
  members: Employee[];
  budget: number;
}

export interface Department {
  dept_id: string;
  name: string;
  head_count: number;
  teams: Team[];
}

const OrganizationStructure = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [expandedDepartments, setExpandedDepartments] =
    useState<DataTableExpandedRows>({});
  const [expandedTeams, setExpandedTeams] = useState<DataTableExpandedRows>({});
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedStatuses, setSelectedStatuses] = useState<{
    [key in Project["status"]]: boolean;
  }>({
    "Behind Schedule": true,
    "On Track": true,
    Completed: true,
  });

  // Fetch data
  useEffect(() => {
    fetch("/demo/data/dataProblemTwo.json")
      .then((res) => res.json())
      .then((data) => setDepartments(data.organization.departments));
  }, []);

  // Calculate total members across all teams in a department
  const getTotalMembers = (dept: Department) => {
    return dept.teams.reduce((sum, team) => sum + team.members.length, 0);
  };

  // Get the first team ID (for demo purposes)
  const getFirstTeamId = (dept: Department) => {
    return dept.teams[0]?.team_id || "N/A";
  };

  // Calculate budget utilization percentage (example: vs 500,000 budget cap)
  const getBudgetUtilization = (dept: Department) => {
    const totalBudget = dept.teams.reduce((sum, team) => sum + team.budget, 0);
    return (totalBudget / 500000) * 100; // Adjust denominator as needed
  };

  const filteredDepartments = useMemo(() => {
    return departments
      .map((dept) => ({
        ...dept,
        teams: dept.teams
          .map((team) => ({
            ...team,
            members: team.members.filter(
              (member) =>
                (selectedSkill === "" ||
                  member.skills.includes(selectedSkill)) &&
                member.projects.some(
                  (project) => selectedStatuses[project.status]
                )
            ),
          }))
          .filter((team) => team.members.length > 0),
      }))
      .filter((dept) => dept.teams.length > 0);
  }, [departments, selectedSkill, selectedStatuses]);

  const teamsTemplate = (department: Department) => (
    <TeamsTable
      teams={department.teams}
      expandedRows={expandedTeams}
      onRowToggle={(e) => {
        if (e.data && !Array.isArray(e.data)) setExpandedTeams(e.data);
      }}
    />
  );

  return (
    <div className="card p-4">
      <div className="flex justify-content-between mb-4">
        <h2>Organization Structure</h2>
        <InputText
          placeholder="Filter by skills/projects..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <div className="flex gap-4 mb-4">
        {/* Skills Dropdown */}
        <Dropdown
          value={selectedSkill}
          options={[
            { label: "All Skills", value: "" },
            ...Array.from(
              new Set(
                departments.flatMap((dept) =>
                  dept.teams.flatMap((team) =>
                    team.members.flatMap((member) => member.skills)
                  )
                )
              )
            ).map((skill) => ({ label: skill, value: skill })),
          ]}
          onChange={(e) => setSelectedSkill(e.value)}
          placeholder="Filter by skill"
        />

        {/* Status Checkboxes */}
        <div className="flex align-items-center gap-3">
          {(["Behind Schedule", "On Track", "Completed"] as const).map(
            (status) => (
              <div key={status} className="flex align-items-center">
                <Checkbox
                  inputId={status}
                  checked={selectedStatuses[status]}
                  onChange={(e) =>
                    setSelectedStatuses((prev) => ({
                      ...prev,
                      [status]: e.checked ?? false,
                    }))
                  }
                />
                <label htmlFor={status} className="ml-2">
                  {status}
                </label>
              </div>
            )
          )}
        </div>
      </div>
      <DataTable
        value={filteredDepartments}
        dataKey="dept_id"
        globalFilter={globalFilter}
        expandedRows={expandedDepartments}
        onRowToggle={(e) => {
          if (e.data && !Array.isArray(e.data)) setExpandedDepartments(e.data);
        }}
        rowExpansionTemplate={teamsTemplate}
      >
        <Column expander style={{ width: "3rem" }} />
        <Column field="name" header="Department" />
        <Column header="Team ID" body={(dept) => getFirstTeamId(dept)} />
        <Column header="Member Count" body={(dept) => getTotalMembers(dept)} />
        <Column
          header="Budget Utilization"
          body={(dept) => (
            <ProgressBar
              value={getBudgetUtilization(dept)}
              showValue={false}
              style={{ height: "10px" }}
            />
          )}
        />
      </DataTable>
    </div>
  );
};

export default OrganizationStructure;
