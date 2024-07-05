import Voting from '@/components/Voting'
import React from 'react'

const page = ({ params }: { params: { id: string | number } }) => {
  return (
    <div>
         <Voting id={params.id} />
    </div>
  )
}

export default page