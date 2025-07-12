import React from "react";
import DataLoader from "../../../ui/DataLoader";
import { Button, Switch } from "@material-tailwind/react";
import { Link } from "react-router";

const AdminEmployeeTable = ({
  data,
  isLoading,
  onVerify,
  onFire,
  onPromote,
  onDemote,
  onSalaryChange,
  onRehire,
}) => {
  const [fireModal, setFireModal] = React.useState({
    open: false,
    email: null,
  });

  if (isLoading) return <DataLoader label="Loading employees..." />;

  if (!data.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No employees or HRs found.
      </div>
    );
  }

  // Desktop Table
  return (
    <>
      <div className="hidden lg:block">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider w-1/12">
                Name
              </th>
              <th className="py-3 px-4 text-left w-2/12">Email</th>
              <th className="py-3 px-4 text-center w-1/12">Role</th>
              <th className="py-3 px-4 text-center w-1/12">Verified</th>
              <th className="py-3 px-4 text-left w-2/12">Bank Account</th>
              <th className="py-3 px-4 text-right w-1/12">Salary</th>
              <th className="py-3 px-4 text-center w-1/12">Promote</th>
              <th className="py-3 px-4 text-center w-1/12">Fire</th>
              <th className="py-3 px-4 text-center w-1/12">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((emp) => (
              <tr key={emp.email} className={emp.fired ? "opacity-50" : ""}>
                <td className="py-3 px-4 text-sm text-left w-1/12">
                  {emp.name}
                </td>
                <td
                  className="py-3 px-4 text-sm text-left w-2/12 break-all"
                  title={emp.email}
                >
                  {emp.email}
                </td>
                <td className="py-3 px-4 text-sm">{emp.role}</td>
                <td className="py-3 px-4 text-sm">
                  <Switch
                    checked={emp.isVerified}
                    onChange={() =>
                      onVerify &&
                      onVerify({
                        email: emp.email,
                        isVerified: !emp.isVerified,
                      })
                    }
                    color={emp.isVerified ? "green" : "red"}
                    disabled={emp.fired}
                  />
                </td>
                <td className="py-3 px-4 text-sm text-left w-2/12">
                  {emp.bank_account_no}
                </td>
                <td className="py-3 px-4 text-sm text-right w-1/12">
                  <span
                    className={`cursor-pointer text-blue-700 underline ${
                      emp.fired ? "pointer-events-none opacity-50" : ""
                    }`}
                    title="Click to change salary"
                    onClick={async () => {
                      if (emp.fired) return;
                      const { value: newSalary } = await import(
                        "../../../ui/CustomSwal"
                      )
                        .then((m) => m.default)
                        .then((CustomSwal) =>
                          CustomSwal.fire({
                            title: `Enter new salary for ${emp.name}`,
                            input: "number",
                            inputValue: emp.salary,
                            showCancelButton: true,
                            confirmButtonText: "Update",
                            cancelButtonText: "Cancel",
                            customClass: {
                              actions:
                                "flex gap-3 flex-row-reverse justify-center",
                            },
                            inputValidator: (value) => {
                              if (!value) {
                                return "You need to enter a salary!";
                              }
                              const parsedValue = parseFloat(value);
                              if (isNaN(parsedValue)) {
                                return "Please enter a valid number.";
                              }
                              if (parsedValue <= emp.salary) {
                                return "New salary must be greater than current salary.";
                              }
                            },
                          })
                        );
                      if (newSalary !== undefined && newSalary !== null) {
                        const parsedSalary = parseFloat(newSalary);
                        if (!isNaN(parsedSalary) && parsedSalary > emp.salary) {
                          onSalaryChange &&
                            onSalaryChange({
                              email: emp.email,
                              salary: parsedSalary,
                            });
                        }
                      }
                    }}
                  >
                    ${emp.salary}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-center w-1/12">
                  {emp.role === "Employee" && !emp.fired ? (
                    <Button
                      size="sm"
                      color="blue"
                      className="shadow-none"
                      onClick={() => onPromote && onPromote(emp.email)}
                    >
                      Make HR
                    </Button>
                  ) : emp.role === "HR" && !emp.fired ? (
                    <Button
                      size="sm"
                      color="amber"
                      className="shadow-none"
                      onClick={() => onDemote && onDemote(emp.email)}
                    >
                      Demote
                    </Button>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-center w-1/12">
                  {emp.fired ? (
                    <Button
                      size="sm"
                      color="green"
                      className="shadow-none"
                      onClick={() => onRehire && onRehire(emp.email)}
                    >
                      Rehire
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      color="red"
                      className="shadow-none"
                      onClick={() =>
                        setFireModal({ open: true, email: emp.email })
                      }
                    >
                      Fire
                    </Button>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-center w-1/12">
                  <Link
                    to={`/details/${emp.email}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-3">
        {data.map((emp) => (
          <div
            key={emp.email}
            className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${
              emp.fired ? "opacity-50" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900 text-lg">
                  {emp.name}
                </h3>
                <p
                  className="text-sm text-gray-500 mt-1 break-all"
                  title={emp.email}
                >
                  {emp.email}
                </p>
                <p className="text-sm text-gray-500 mt-1">Role: {emp.role}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Bank: {emp.bank_account_no}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Salary:{" "}
                  <span
                    className={`cursor-pointer text-blue-700 underline ${
                      emp.fired ? "pointer-events-none opacity-50" : ""
                    }`}
                    title="Click to change salary"
                    onClick={async () => {
                      if (emp.fired) return;
                      const { value: newSalary } = await import(
                        "../../../ui/CustomSwal"
                      )
                        .then((m) => m.default)
                        .then((CustomSwal) =>
                          CustomSwal.fire({
                            title: `Enter new salary for ${emp.name}`,
                            input: "number",
                            inputValue: emp.salary,
                            showCancelButton: true,
                            confirmButtonText: "Update",
                            cancelButtonText: "Cancel",
                            customClass: {
                              actions:
                                "flex gap-3 flex-row-reverse justify-center",
                            },
                            inputValidator: (value) => {
                              if (!value) {
                                return "You need to enter a salary!";
                              }
                              const parsedValue = parseFloat(value);
                              if (isNaN(parsedValue)) {
                                return "Please enter a valid number.";
                              }
                              if (parsedValue <= emp.salary) {
                                return "New salary must be greater than current salary.";
                              }
                            },
                          })
                        );
                      if (newSalary !== undefined && newSalary !== null) {
                        const parsedSalary = parseFloat(newSalary);
                        if (!isNaN(parsedSalary) && parsedSalary > emp.salary) {
                          onSalaryChange &&
                            onSalaryChange({
                              email: emp.email,
                              salary: parsedSalary,
                            });
                        }
                      }
                    }}
                  >
                    ${emp.salary}
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Switch
                  checked={emp.isVerified}
                  onChange={() =>
                    onVerify &&
                    onVerify({
                      email: emp.email,
                      isVerified: !emp.isVerified,
                    })
                  }
                  color={emp.isVerified ? "green" : "red"}
                  disabled={emp.fired}
                />
                {emp.role === "Employee" && !emp.fired ? (
                  <Button
                    size="sm"
                    color="blue"
                    className="shadow-none"
                    onClick={() => onPromote && onPromote(emp.email)}
                  >
                    Make HR
                  </Button>
                ) : emp.role === "HR" && !emp.fired ? (
                  <Button
                    size="sm"
                    color="amber"
                    className="shadow-none"
                    onClick={() => onDemote && onDemote(emp.email)}
                  >
                    Demote
                  </Button>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
                {emp.fired ? (
                  <Button
                    size="sm"
                    color="green"
                    className="shadow-none"
                    onClick={() => onRehire && onRehire(emp.email)}
                  >
                    Rehire
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    color="red"
                    className="shadow-none"
                    onClick={() =>
                      setFireModal({ open: true, email: emp.email })
                    }
                  >
                    Fire
                  </Button>
                )}
                <Link
                  to={`/details/${emp.email}`}
                  className="text-blue-600 underline text-sm"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Fire Modal */}
      {fireModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>Are you sure you want to fire this employee?</p>
            <div className="mt-4 flex gap-2">
              <Button
                color="red"
                onClick={() => {
                  onFire && onFire(fireModal.email);
                  setFireModal({ open: false, email: null });
                }}
              >
                Confirm
              </Button>
              <Button
                color="gray"
                onClick={() => setFireModal({ open: false, email: null })}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminEmployeeTable;
