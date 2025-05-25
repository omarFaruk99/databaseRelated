import { Button } from "primereact/button";
import { Course } from "../AcademicRecordsTable";

interface WaitlistButtonProps {
  course: Course;
  onJoinWaitlist: (courseCode: string) => void;
}

const WaitlistButton = ({ course, onJoinWaitlist }: WaitlistButtonProps) => {
  if (course.enrollment.current >= course.enrollment.capacity) {
    return (
      <Button
        label="Join Waitlist"
        className="p-button-sm p-button-warning"
        onClick={() => onJoinWaitlist(course.course_code)}
      />
    );
  }
  return null;
};

export default WaitlistButton;
