import PanelTableButtons from '@/components/adminPageComponents/PanelTableButtons';
import Users from '@/components/adminPageComponents/Users';
import React from 'react';

export default function UsersPage() {
  return (
    <div className="flex items-center justify-center h-screen relative">
      <PanelTableButtons />
      <Users />
    </div>
  );
}
