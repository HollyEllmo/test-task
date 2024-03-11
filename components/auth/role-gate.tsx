"use client";

import { useCurrentRole } from "@/hooks/use-current-role";

// import { UserRole } from "@prisma/client";
import { FormError } from "../form-error";

type UserRole = "ADMIN" | "MODERATOR" | "USER";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permition to biew this content!" />
    );
  }

  return <>{children}</>;
};
