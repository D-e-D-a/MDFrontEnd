import PanelTableButtons from '@/components/adminPageComponents/PanelTableButtons'
import Sessions from '@/components/adminPageComponents/Sessions'
import React from 'react'

export default function AdminPage() {
  return (
    <div className='flex items-center justify-center h-screen relative'>
      <PanelTableButtons />
        <Sessions />
    </div>
  )
}
