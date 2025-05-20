import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import InterviewCard from '../../components/InterviewCard';
import { dummyInterviews } from '@/constants';
import InterviewCard from '@/components/InterviewCard';

const Page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6">
          <h2>Get interview-ready by practicing mock sessions and receiving instant feedback</h2>
          <p className="text-lg">Let's Practice</p>

          <button className="btn-primary max-sm:w-full">
            <Link href="/interview">Start</Link>
          </button>

        </div>
        <Image src="/robot.png" alt="robot" width={400} height={400} className="max-sm:hidden"/>
      </section>

      <section className="flex flex-col gap-6 items-center justify-center">
        <h2 className="text-2xl">Your Interviews</h2>

        <div className="interview-section flex justify-center gap-5">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}

          {/* <p>No records yet</p> */}
        </div>
      
      </section>
      <section className="flex flex-col gap-6 items-center justify-center">
        <h2>Let's Take an Interview</h2>

        <div className="interview-section flex justify-center gap-5">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
          <p>Tere are no interviews available</p>
      </section>
    </>
  )
}

export default Page