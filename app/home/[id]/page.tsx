import DailyVoting from '@/components/DailyVoting';

export default function Page({ params }: { params: { id: string | number } }) {
  return (
    <div className="flex flex-col justify-center items-center  mt-20">
      <h1 className="text-3xl font-semibold">Dnevni red</h1>
      <div className='border mt-5 rounded-lg bg-slate-950'>
        <DailyVoting id={params.id} />
      </div>
    </div>
  );
}
