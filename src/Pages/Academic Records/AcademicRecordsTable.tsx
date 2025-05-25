import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import CourseExpansionTemplate from "./components/CourseExpansionTemplate";
import WaitlistButton from "./components/WaitlistButton";

interface Faculty {
  instructor: string;
  department: string;
}

interface Schedule {
  time: string;
  room: string;
}

interface Enrollment {
  current: number;
  capacity: number;
}

export interface Course {
  course_code: string;
  title: string;
  faculty: Faculty;
  schedule: Schedule;
  enrollment: Enrollment;
  prerequisites: string[];
  status: "Open" | "Closed";
}

const AcademicRecordsTable = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    department: "",
    status: [] as string[],
    instructor: "",
  });

  useEffect(() => {
    fetch("/demo/data/dataProblemThree.json")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.academic_records.courses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  console.log("fetch data=======>", courses);

  const filteredCourses = courses.filter((course) => {
    const isFull = course.enrollment.current >= course.enrollment.capacity;
    const isClosed = course.status === "Closed" || isFull;

    return (
      (!filters.department ||
        course.faculty.department === filters.department) &&
      (filters.status.length === 0 ||
        filters.status.some((status) =>
          status === "Closed" ? isClosed : course.status === status
        )) &&
      (!filters.instructor ||
        course.faculty.instructor
          .toLowerCase()
          .includes(filters.instructor.toLowerCase()))
    );
  });

  // Status pill template
  const statusTemplate = (rowData: Course) => {
    const isFull = rowData.enrollment.current >= rowData.enrollment.capacity;
    return (
      <Tag
        value={isFull ? "Closed" : rowData.status}
        severity={isFull ? "danger" : "success"}
      />
    );
  };

  // Enrollment status template (e.g., "28/35")
  const enrollmentTemplate = (rowData: Course) => {
    const enrollmentPercent = Math.round(
      (rowData.enrollment.current / rowData.enrollment.capacity) * 100
    );

    // Determine progress bar color based on enrollment
    const progressColor =
      enrollmentPercent >= 90
        ? "var(--red-500)"
        : enrollmentPercent >= 75
        ? "var(--orange-500)"
        : "var(--green-500)";

    return (
      <div className="w-full">
        <div className="flex justify-content-between mb-1">
          <span className="font-medium">
            {rowData.enrollment.current}/{rowData.enrollment.capacity}
          </span>
          <span className="text-color-secondary">{enrollmentPercent}%</span>
        </div>
        <ProgressBar
          value={enrollmentPercent}
          style={{
            height: "8px",
            backgroundColor: "var(--surface-200)",
            // Use a workaround for CSS variables
            ...({
              "--progressbar-value-color": progressColor,
            } as React.CSSProperties),
          }}
          showValue={false}
        />
      </div>
    );
  };

  // Mock function for waitlist logic
  const handleJoinWaitlist = (courseCode: string) => {
    console.log("Added to waitlist:", courseCode);
    // Replace with actual logic (e.g., API call or state update)
  };

  if (loading) {
    return <div className="text-center">Loading courses...</div>;
  }

  return (
    <div className="card p-4">
      <div className="grid p-fluid mb-4">
        {/* Department Filter */}
        <div className="col-12 md:col-4">
          <Dropdown
            value={filters.department}
            options={[
              { label: "All Departments", value: "" },
              ...Array.from(
                new Set(courses.map((c) => c.faculty.department))
              ).map((d) => ({ label: d, value: d })),
            ]}
            onChange={(e) => setFilters({ ...filters, department: e.value })}
            placeholder="Filter by Department"
          />
        </div>

        {/* Status Filter */}
        <div className="col-12 md:col-4">
          <MultiSelect
            value={filters.status}
            options={["Open", "Closed"].map((s) => ({
              label: s,
              value: s,
            }))}
            onChange={(e) => setFilters({ ...filters, status: e.value })}
            placeholder="Filter by Status"
          />
        </div>

        {/* Clear Button */}
        <div className="col-12 md:col-4">
          <Button
            label="Clear Filters"
            icon="pi pi-filter-slash"
            className="p-button-outlined"
            onClick={() =>
              setFilters({ department: "", status: [], instructor: "" })
            }
          />
        </div>
      </div>
      <DataTable
        value={filteredCourses}
        tableStyle={{ minWidth: "60rem" }}
        expandedRows={expandedRows}
        onRowToggle={(e) => {
          if (e.data && typeof e.data === "object" && !Array.isArray(e.data)) {
            setExpandedRows(e.data as DataTableExpandedRows);
          }
        }}
        rowExpansionTemplate={(rowData) => (
          <CourseExpansionTemplate course={rowData} />
        )}
        dataKey="course_code"
        emptyMessage="No courses match your filters"
      >
        {/* Expander column (for nested data) */}
        <Column expander style={{ width: "3rem" }} />

        {/* Course Code */}
        <Column field="course_code" header="Course Code" />

        {/* Title */}
        <Column field="title" header="Title" />

        {/* Instructor (nested field) */}
        <Column
          header="Instructor"
          body={(rowData) => rowData.faculty.instructor}
        />

        {/* Enrollment Status */}
        <Column
          header="Enrollment"
          body={enrollmentTemplate}
          sortable
          sortField="enrollment.current"
          style={{ minWidth: "180px" }}
        />

        {/* Status Pill */}
        <Column header="Status" body={statusTemplate} />

        {/* Waitlist Button Column */}
        <Column
          header="Action"
          body={(rowData: Course) => (
            <WaitlistButton
              course={rowData}
              onJoinWaitlist={handleJoinWaitlist}
            />
          )}
          style={{ minWidth: "120px" }}
        />
      </DataTable>
    </div>
  );
};

export default AcademicRecordsTable;
