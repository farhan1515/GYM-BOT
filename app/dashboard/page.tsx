'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  TrendingUp,
  MessageSquare,
  Download,
  Search,
  Calendar,
  Phone,
  Target,
  Activity,
  Clock,
  BarChart3,
  Dumbbell
} from 'lucide-react';
import { supabase, type User } from '@/lib/supabase';

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    todayLeads: 0,
    whatsappSent: 0,
    conversionRate: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userData: User[]) => {
    const today = new Date().toDateString();
    const todayLeads = userData.filter(user => 
      new Date(user.created_at || '').toDateString() === today
    ).length;
    
    const whatsappSent = userData.filter(user => user.whatsapp_sent).length;
    const conversionRate = userData.length > 0 ? (whatsappSent / userData.length) * 100 : 0;

    setStats({
      totalLeads: userData.length,
      todayLeads,
      whatsappSent,
      conversionRate: Math.round(conversionRate)
    });
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number?.includes(searchTerm) ||
      user.fitness_goal?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      'Name', 'Age', 'Weight (kg)', 'Height (cm)', 'Fitness Level', 
      'Fitness Goal', 'Workout Days', 'Phone Number', 'WhatsApp Sent', 'Created At'
    ];

    const csvData = filteredUsers.map(user => [
      user.name || '',
      user.age || '',
      user.weight || '',
      user.height || '',
      user.fitness_level || '',
      user.fitness_goal || '',
      user.workout_days || '',
      user.phone_number || '',
      user.whatsapp_sent ? 'Yes' : 'No',
      user.created_at ? new Date(user.created_at).toLocaleDateString() : ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitness-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'Weight Loss': return '🔥';
      case 'Muscle Gain': return '💪';
      case 'Strength': return '⚡';
      case 'Maintenance': return '⚖️';
      default: return '🎯';
    }
  };

  const getFitnessLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Dumbbell className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Fitness Lead Dashboard</h1>
                <p className="text-slate-300">Manage your gym leads and analytics</p>
              </div>
            </div>
            <Button 
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Leads</p>
                    <p className="text-3xl font-bold text-white">{stats.totalLeads}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Today's Leads</p>
                    <p className="text-3xl font-bold text-white">{stats.todayLeads}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">WhatsApp Sent</p>
                    <p className="text-3xl font-bold text-white">{stats.whatsappSent}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Conversion Rate</p>
                    <p className="text-3xl font-bold text-white">{stats.conversionRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search & Filter Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, phone, or fitness goal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                All Leads ({filteredUsers.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Age</TableHead>
                    <TableHead className="text-slate-300">Stats</TableHead>
                    <TableHead className="text-slate-300">Level</TableHead>
                    <TableHead className="text-slate-300">Goal</TableHead>
                    <TableHead className="text-slate-300">Workout Days</TableHead>
                    <TableHead className="text-slate-300">Phone</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="text-white font-medium">
                        {user.name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {user.age || 'N/A'}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="text-sm">
                          <div>{user.weight || 'N/A'} kg</div>
                          <div className="text-slate-400">{user.height || 'N/A'} cm</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getFitnessLevelColor(user.fitness_level || '')}>
                          {user.fitness_level || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="flex items-center">
                          <span className="mr-2">{getGoalIcon(user.fitness_goal || '')}</span>
                          {user.fitness_goal || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 mr-1 text-blue-400" />
                          {user.workout_days || 'N/A'}/week
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-green-400" />
                          {user.phone_number || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={user.whatsapp_sent 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        }>
                          {user.whatsapp_sent ? '✓ Sent' : '⏳ Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-1 text-slate-400" />
                          {user.created_at 
                            ? new Date(user.created_at).toLocaleDateString()
                            : 'N/A'
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No leads found</p>
                <p className="text-slate-500">Try adjusting your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}