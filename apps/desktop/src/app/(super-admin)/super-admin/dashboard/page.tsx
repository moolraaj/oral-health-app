"use client";

import { useGetUsersQuery } from "@/(store)/services/user/userApi";
import { useState } from "react";
import { ShieldCheck, Users, UserCheck } from "lucide-react";

interface IUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'user' | 'admin' | 'ambassador' | 'super-admin';
  status: 'pending' | 'approved' | 'rejected';
}

export default function ManageUsers() {
  // Fetch users by role
  const { data: adminData, isLoading: adminLoading, refetch: refetchAdmins } = useGetUsersQuery({ page: 1, limit: 15, role: 'admin' });
  const { data: userData, isLoading: userLoading, refetch: refetchUsers } = useGetUsersQuery({ page: 1, limit: 15, role: 'user' });
  const { data: ambassadorData, isLoading: ambassadorLoading, refetch: refetchAmbassadors } = useGetUsersQuery({ page: 1, limit: 15, role: 'ambassador' });

  const [actionLoading, setActionLoading] = useState(false);

  const updateUser = async (id: string, action: "approved" | "rejected", currentRole: string) => {
    setActionLoading(true);
    let body: any = {
      status: action,
      role: action === "approved"
        ? (currentRole === "admin" || currentRole === "ambassador" ? currentRole : "admin")
        : "user"
    };

    try {
      const res = await fetch(`/api/auth/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        refetchAdmins();
        refetchUsers();
        refetchAmbassadors();
      } else {
        alert(data.error || "Failed to update user.");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  console.log(userData)

  if (adminLoading || userLoading || ambassadorLoading) return <p>Loading...</p>;

  return (
    <div className="dash_outer outer_wrapper">
      <div className="dash_inner">
        <div className="dash_wrapper">


          <div className="admins dash_holder">
            
            <ShieldCheck size={20} />
            <h3>Admins</h3>
            <p>{adminData.roles.admin}</p>
          </div>

          <div className="users dash_holder">
            <Users size={20} />
            <h3>Users</h3>
            <p>{userData.roles.user}</p>
          </div>

          <div className="ambassadors dash_holder">
            <UserCheck size={20} />
            <h3>Ambassadors</h3>
            <p>{ambassadorData.roles.ambassador}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
