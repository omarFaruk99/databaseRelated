import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import { Link } from "react-router-dom";
import { Course } from "../AcademicRecordsTable";

interface CourseExpansionTemplateProps {
  course: Course;
}

const CourseExpansionTemplate = ({ course }: CourseExpansionTemplateProps) => {
  return (
    <div className="p-3 surface-50 border-round">
      <div className="grid">
        {/* Schedule Section */}
        <div className="col-12 md:col-6 p-3">
          <div className="flex align-items-center mb-2">
            <i className="pi pi-calendar mr-2 text-primary"></i>
            <h4 className="m-0">Schedule</h4>
          </div>
          <Divider />
          <div className="grid">
            <div className="col-4 font-medium">Time:</div>
            <div className="col-8">{course.schedule.time}</div>

            <div className="col-4 font-medium">Room:</div>
            <div className="col-8">
              <Badge
                value={course.schedule.room}
                severity="info"
                className="mr-2"
              />
            </div>
          </div>
        </div>

        {/* Prerequisites Section */}
        <div className="col-12 md:col-6 p-3">
          <div className="flex align-items-center mb-2">
            <i className="pi pi-book mr-2 text-primary"></i>
            <h4 className="m-0">Prerequisites</h4>
          </div>
          <Divider />
          <div className="flex flex-wrap gap-2">
            {course.prerequisites.length > 0 ? (
              course.prerequisites.map((prereq: string) => (
                <Link
                  key={prereq}
                  to={`/courses/prerequisite/${prereq}`}
                  className="text-color-secondary hover:underline"
                >
                  {prereq}
                </Link>
              ))
            ) : (
              <div className="flex align-items-center text-color-secondary">
                <i className="pi pi-info-circle mr-2"></i>
                No prerequisites required
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseExpansionTemplate;
