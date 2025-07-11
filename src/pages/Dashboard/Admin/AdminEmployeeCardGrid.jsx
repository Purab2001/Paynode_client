import React from "react";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import CustomSwal from "../../../ui/CustomSwal"; // Import CustomSwal

const AdminEmployeeCardGrid = ({
  data,
  isLoading,
  onVerify,
  onFire,
  onPromote,
  onDemote,
  onRehire,
  onSalaryChange,
}) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading employees...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">No employees found.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {data.map((employee) => (
        <Card key={employee._id} className="w-full shadow-md p-2">
          <CardBody className="p-3">
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-1 text-base"
            >
              {employee.name}
            </Typography>
            <Typography className="font-normal text-gray-700 text-xs">
              Email: {employee.email}
            </Typography>
            <Typography className="font-normal text-gray-700 text-xs">
              Role: {employee.role}
            </Typography>
            <Typography className="font-normal text-gray-700 text-xs">
              Salary: ${employee.salary}
            </Typography>
            <Typography className="font-normal text-gray-700 text-xs">
              Verified: {employee.isVerified ? "Yes" : "No"}
            </Typography>
            <Typography className="font-normal text-gray-700 text-xs">
              Status: {employee.status}
            </Typography>

            <div className="flex flex-wrap gap-1 mt-2">
              {employee.role === "employee" && (
                <Button
                  size="sm"
                  color={employee.isVerified ? "red" : "green"}
                  onClick={() =>
                    onVerify({
                      email: employee.email,
                      isVerified: !employee.isVerified,
                    })
                  }
                >
                  {employee.isVerified ? "Unverify" : "Verify"}
                </Button>
              )}

              {employee.status === "fired" ? (
                <Button
                  size="sm"
                  color="green"
                  onClick={() => onRehire(employee.email)}
                >
                  Rehire
                </Button>
              ) : (
                <Button
                  size="sm"
                  color="red"
                  onClick={() => onFire(employee.email)}
                >
                  Fire
                </Button>
              )}

              {employee.role === "employee" && (
                <Button
                  size="sm"
                  color="blue"
                  onClick={() => onPromote(employee.email)}
                >
                  Promote to HR
                </Button>
              )}

              {employee.role === "hr" && (
                <Button
                  size="sm"
                  color="orange"
                  onClick={() => onDemote(employee.email)}
                >
                  Demote to Employee
                </Button>
              )}

              <Button
                size="sm"
                color="purple"
                onClick={async () => {
                  const { value: newSalary } = await CustomSwal.fire({
                    title: `Enter new salary for ${employee.name}`,
                    input: "number",
                    inputValue: employee.salary,
                    showCancelButton: true,
                    confirmButtonText: "Update",
                    cancelButtonText: "Cancel",
                    customClass: {
                      actions: "flex gap-3 flex-row-reverse justify-center",
                    },
                    inputValidator: (value) => {
                      if (!value) {
                        return "You need to enter a salary!";
                      }
                      const parsedValue = parseFloat(value);
                      if (isNaN(parsedValue)) {
                        return "Please enter a valid number.";
                      }
                      if (parsedValue <= employee.salary) {
                        return "New salary must be greater than current salary.";
                      }
                    },
                  });

                  if (newSalary !== undefined && newSalary !== null) {
                    const parsedSalary = parseFloat(newSalary);
                    if (
                      !isNaN(parsedSalary) &&
                      parsedSalary > employee.salary
                    ) {
                      onSalaryChange({
                        email: employee.email,
                        salary: parsedSalary,
                      });
                    }
                  }
                }}
              >
                Change Salary
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default AdminEmployeeCardGrid;
