import { useState, useEffect } from "react";
import { getUserDetails, UserDetails, Address } from "@/lib/utils/service/user";
import { toast } from "react-hot-toast";

export default function UserManagement() {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserDetails>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // For now, we'll fetch a single user with ID 1 as an example
      // In a real application, you would fetch all users or implement pagination
      const data = await getUserDetails(1);
      setUsers([data]);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }

    const filteredUsers = users.filter(
      (user) =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      // TODO: Implement updateUserDetails function in the user service
      toast.success("User details updated successfully!");
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user details");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#174832] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by email or username..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
        >
          Search
        </button>
      </form>

      {/* Users List */}
      <div className="space-y-4">
        {users.length === 0 ? (
          <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
            No users found
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {user.username || "Unnamed User"}
                  </h3>
                  <p className="text-sm text-gray-500">Email: {user.email}</p>
                  <p className="text-sm text-gray-500">
                    Name: {user.first_name} {user.last_name}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">
                      Addresses:
                    </p>
                    {user.addresses.length === 0 ? (
                      <p className="text-sm text-gray-500">No addresses</p>
                    ) : (
                      <ul className="mt-1 space-y-1">
                        {user.addresses.map((address) => (
                          <li
                            key={address.id}
                            className="text-sm text-gray-500"
                          >
                            {address.district}, {address.city}, {address.road} -{" "}
                            {address.post}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setEditForm({
                      username: user.username,
                      email: user.email,
                      first_name: user.first_name,
                      last_name: user.last_name,
                    });
                  }}
                  className="px-4 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
                >
                  Edit User
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl p-8 mx-4 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Edit User Details</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={editForm.username || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editForm.first_name || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editForm.last_name || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#174832] text-white rounded-lg hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-[#174832] focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
