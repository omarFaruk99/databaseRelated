import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { Project } from "../OrganizationStructure";

interface ProjectsTableProps {
  projects: Project[];
}

const ProjectsTable = ({ projects }: ProjectsTableProps) => {
  return (
    <DataTable value={projects} dataKey="project_id">
      <Column field="name" header="Project" />
      <Column
        header="Status"
        body={(project: Project) => (
          <Tag
            value={project.status}
            severity={
              project.status === "Behind Schedule"
                ? "danger"
                : project.status === "On Track"
                ? "warning"
                : "success"
            }
          />
        )}
      />
      <Column
        header="Completion"
        body={(project: Project) => (
          <ProgressBar
            value={project.completion}
            showValue={true}
            style={{ height: "10px" }}
          />
        )}
      />
    </DataTable>
  );
};

export default ProjectsTable;
