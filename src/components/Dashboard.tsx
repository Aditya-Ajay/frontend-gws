import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Users,
  Bell,
  Database,
  LogOut,
  ChevronLeft,
  Bell as BellIcon,
  ChevronRight,
  CheckCircle2,
  Circle,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[] | null>(null);
  const [singleUser, setSingleUser] = useState<SingleUser | null>(null);
  const [jobStatuses, setJobStatuses] = useState<{ [key: string]: string }>({}); // Store job statuses by email
  const [backups, setBackups] = useState<{ messageId: string; snippet: string; labelIds: string; size: number; status: string; createdAt: string; }[]>([])
  const [backupDetails, setBackupDetails] = useState<{ key: string; meta: string; status: string }[] | null>(null);

  interface UserName {
    fullName: string;
    thumbNailURL: string;
  }

  interface User {
    id: string;
    name: UserName;
    primaryEmail: string;
    lastBackup: string;
    status: string;
  }

  interface SingleUser {
    displayName: string;
    email: string;
    [key: string]: any;
  }

  const handleLogout = ()=>{
    window.location.href="http://localhost:8080/auth/logout"
  }

  const getUser = async () => {
    try {
      const url = `http://localhost:8080//auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      setSingleUser(data.user._json);
      console.log(data.user._json);
    } catch (err) {
      console.log(err);
    }
  };

  async function fetchUserData() {
    try {
      const response = await axios.get("http://localhost:8080/user/get/user", {
        withCredentials: true,
      });
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  async function fetchRecentMessages() {
    try {
      const response = await axios.get("http://localhost:8080/api/recent/messages", {
        withCredentials: true,
      });
      setBackups(response.data.data.messages);
      setBackupDetails(response.data.data.backups)
      console.log("BACKUP DETAILS" , backupDetails)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      await getUser();
    };
    fetchRecentMessages()
    fetchUser();
    fetchUserData();
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },

  ];

  const stats = [
    { title: 'Total employees', value: users?.length.toString(), change: '+10.0%', viewAll: true },
  ];

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const pollJobStatus = (jobId: string, email: string) => {
    const interval = 5000; // 5 seconds polling interval

    const checkStatus = () => {
      axios
        .get(`http://localhost:8080/job-status/${jobId}`, { withCredentials: true })
        .then((response) => {
          const { status } = response.data;
          console.log(`Job for ${email} (Job ID: ${jobId}) status:`, status);

          // Update job status for this email
          setJobStatuses((prev) => ({
            ...prev,
            [email]: status,
          }));

          if (status === 'completed' || status === 'failed') {
            console.log(`Polling stopped for ${email} (Job ID: ${jobId}). Final status:`, status);
            clearInterval(polling); // Stop polling when status is "completed" or "failed"
          }
        })
        .catch((error) => {
          console.error(`Error checking status for job ID ${jobId} (Email: ${email}):`, error);
          clearInterval(polling); // Stop polling if an error occurs
        });
    };

    const polling = setInterval(checkStatus, interval); // Start polling
  };

  const startPollingForJobs = (jobs: { email: string; jobId: string }[]) => {
    jobs.forEach((job) => pollJobStatus(job.jobId, job.email));
  };

  const initiateBackup = () => {
    console.log('Selected users:', selectedUsers);

    axios
      .post(
        'http://localhost:8080/gmail/messages',
        { emailIds: selectedUsers },
        { withCredentials: true }
      )
      .then((response) => {
        console.log('Backup initiated:', response.data);
        const jobs = response.data.jobs;
        console.log('Received jobs:', jobs);

        startPollingForJobs(jobs);
      })
      .catch((error) => {
        console.error('Error initiating backup:', error);
      });

    console.log('Initiating backup for users:', selectedUsers);
  };

  return (
    <div className="flex min-h-screen bg-[#1a1d21]">
      {/* Sidebar */}
      <div className="w-64 fixed h-screen bg-[#1a1d21] border-r border-gray-700">
        <div className="p-4 flex items-center gap-2">
          <img
            src="https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=32&h=32&fit=crop&auto=format"
            alt="Logo"
            className="w-8 h-8 rounded-lg"
          />
          <span className="text-white font-bold">ZERO TO ONE</span>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors
                  ${activeTab === item.id ? 'bg-[#2d3139] border-l-4 border-blue-500' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button className="absolute bottom-4 w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 transition-colors" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button className="p-2 rounded-lg bg-gray-800">
            <ChevronLeft className="text-gray-400" />
          </button>

          <div className="flex items-center gap-4">
            <BellIcon className="text-gray-400 mr-10" />
            <div className="flex items-center gap-2">
              <div className="text-white">
                <div>{singleUser?.displayName}</div>
                <div className="text-sm text-gray-400">{singleUser?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 rounded-lg bg-[#1e2227]">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <Users className="text-gray-300" />
                </div>
                {stat.change && (
                  <span className="text-green-500 text-sm">{stat.change}</span>
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.title}</div>
              {stat.viewAll && (
                <button className="text-blue-500 text-sm mt-2 flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* User List and Backup Section */}
        <div className="bg-[#1e2227] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-white text-xl font-semibold mb-2">User Management</h2>
              <p className="text-gray-400">Select users to initiate backup</p>
            </div>
            <button
              onClick={initiateBackup}
              disabled={selectedUsers.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                selectedUsers.length > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              <RefreshCw size={16} />
              Initiate Backup
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="pb-4 text-left font-medium">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-600"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(users ? users.map((user) => user.primaryEmail) : []);
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        checked={!!users && selectedUsers.length === (users?.length || 0)}
                      />
                      Select All
                    </div>
                  </th>
                  <th className="pb-4 text-left font-medium">Name</th>
                  <th className="pb-4 text-left font-medium">Email</th>
                  <th className="pb-4 text-left font-medium">Google Workspace Id</th>
                  <th className="pb-4 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800">
                      <td className="py-3 text-left">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-600"
                          checked={selectedUsers.includes(user.primaryEmail)}
                          onChange={() => toggleUserSelection(user.primaryEmail)}
                        />
                      </td>
                      <td className="py-3 text-left text-gray-300">{user.name.fullName}</td>
                      <td className="py-3 text-left text-gray-300">{user.primaryEmail}</td>
                      <td className="py-3 text-left text-gray-300">{user.id}</td>
                      <td className="py-3 text-left">
                        <div className="flex items-center gap-2">
                          {/* Display job status if available, otherwise "Backup Uninitialized" */}
                          {jobStatuses[user.primaryEmail] ? (
                            <>
                              {jobStatuses[user.primaryEmail] === 'completed' && (
                                <CheckCircle2 className="text-green-500" size={16} />
                              )}
                              {jobStatuses[user.primaryEmail] === 'processing' && (
                                <Circle className="text-yellow-500" size={16} />
                              )}
                              {jobStatuses[user.primaryEmail] === 'failed' && (
                                <Circle className="text-red-500" size={16} />
                              )}
                              <span className="text-gray-300 capitalize">
                                {jobStatuses[user.primaryEmail]}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-300">Backup Uninitialized</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Backups Section */}
        <div className="bg-[#1e2227] rounded-lg p-6 mt-8">
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-white text-xl font-semibold mb-2">Recent Messages</h2>
      <p className="text-gray-400">View recent backups and their status</p>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="text-gray-400 border-b border-gray-700">
          <th className="pb-4 px-4 text-left font-medium">Message ID</th>
          <th className="pb-4 px-4 text-left font-medium">Message Snippet</th>
          <th className="pb-4 px-4 text-left font-medium">Email</th>
        </tr>
      </thead>
      <tbody>
        {backups && backups?.length > 0 ? (
          backups?.map((backup) => {
            // Limit snippet to 14 words
            const words = backup.snippet.split(' ');
            const truncatedSnippet =
              words.length > 14 ? words.slice(0, 14).join(' ') + '...' : backup.snippet;

            return (
              <tr key={backup.messageId} className="border-b border-gray-800">
                <td className="py-3 px-4 text-left text-gray-300">{backup.messageId}</td>
                <td className="py-3 px-4 text-left text-gray-300">{truncatedSnippet}</td>
                {/* Assuming userId is the email; adjust if it's different */}
                <td className="py-3 px-4 text-left text-gray-300">{backup.labelIds}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={3} className="py-3 text-center text-gray-300">
              No recent backups found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
<div className="bg-[#1e2227] rounded-lg p-6 mt-8">
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-white text-xl font-semibold mb-2">Recent Backup Details</h2>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="text-gray-400 border-b border-gray-700">
          <th className="pb-4 px-4 text-left font-medium">KEY </th>
          <th className="pb-4 px-4 text-left font-medium">STATUS</th>
        </tr>
      </thead>
      <tbody>
        {backupDetails && backupDetails?.length > 0 ? (
          backupDetails?.map((backup:any) => {
            return (
              <tr key={backup.messageId} className="border-b border-gray-800">
                <td className="py-3 px-4 text-left text-gray-300">{backup?.key}</td>
                <td className="py-3 px-4 text-left text-gray-300">{backup?.status}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={3} className="py-3 text-center text-gray-300">
              No recent backups found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

      </div>
    </div>
  );
}

export default Dashboard;