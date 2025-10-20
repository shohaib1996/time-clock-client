import EmployeesDetails from "@/components/EmployeesDetails/EmployeesDetails";
import React from "react";

const ViewDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <><EmployeesDetails id={id}/></>;
};

export default ViewDetails;
