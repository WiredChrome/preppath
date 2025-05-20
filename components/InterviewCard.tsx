import { getRandomInterviewCover } from '@/lib/utils';
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import DisplayTechIcons from './DisplayTechIcons';


const InterviewCard = async ({ interviewId, userId, role, type, techstack, createdAt }: InterviewCardProps) => {
    const feedback = null as Feedback | null;
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');
    return (
        // <div className="card-border w-[360px] max-sm:w-full min-h-96">
            <div className="card-interview">
                <div>
                    <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-400">
                        <p className="badge-text">{normalizedType}</p>
                    </div>
                    <Image src={getRandomInterviewCover()} alt="cover" width={90} height={90} className="rounded-full object-fit size-[90px]" />
                        <h3 className="mt-5 capitalize">
                            {role} Interview
                        </h3>
                        <div className="flex flex-row gap-5 mt-3">
                            <div className="flex flex-row gap-2">
                                <Image src="/calender.png" alt="calender" width={22} height={22} />
                                <p>{formattedDate}</p>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <Image src="/star.svg" alt="star" width={22} height={22} />
                                <p>{feedback?.totalScore || '---'}/100</p>
                            </div>
                        </div>
                        <p className="line-clam-2 mt-5">
                            {feedback?.finalAssessment || "No feedback yet"}
                        </p>
                </div>
                <div className="flex flex-row justify-between">
                    <DisplayTechIcons techStack={techstack} />

                    <button className="btn-primary">
                        <Link href={feedback
                            ? '/interview/${interviewId}/feedback' : 'interview/${interviewId}'
                        }>
                            {feedback ? 'View Feedback' : 'Take Interview'}
                        </Link>
                    </button>
                </div>
            </div>
        // </div>
    )
}
export default InterviewCard
// import { cn } from "@/lib/utils"