import Button from "@mui/material/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Student } from "../hooks/useStudents";

interface StudentProfilePageProps {
  students: Student[];
  isAuthenticated: boolean;
  deleteStudent: (id: string) => Promise<void>;
}

function StudentProfilePage({
  students,
  isAuthenticated,
  deleteStudent,
}: StudentProfilePageProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = students.find((student) => student.id === id);

  if (!student) {
    return <h2>Student not found.</h2>;
  }

  // TypeScript now knows this student definitely exists
  const currentStudent = student;

  async function handleDelete(): Promise<void> {
    await deleteStudent(currentStudent.id);
    navigate("/");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "2rem",
      }}
    >
      <div
        className="card"
        style={{
          width: "320px",
          textAlign: "center",
        }}
      >
        <img
          src={currentStudent.avatar}
          alt={currentStudent.name}
          className="card__image"
        />

        <div className="card__body">
          <h2 className="card__name">{currentStudent.name}</h2>

          <p className="card__role">{currentStudent.role}</p>
        </div>

        <div
          className="card__footer"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {isAuthenticated && (
            <>
              <Button
                variant="contained"
                component={Link}
                to={`/students/${currentStudent.id}/edit`}
              >
                Edit
              </Button>

              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}

          <Button variant="outlined" onClick={() => navigate("/")}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StudentProfilePage;
