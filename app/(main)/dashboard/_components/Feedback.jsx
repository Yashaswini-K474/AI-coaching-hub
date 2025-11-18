// import React from 'react'

// function Feedback() {
//     return (
//         <div>

//             <h2 className='font-bold text-xl' >Feedback</h2>

//             <h2 className='text-gray-400'>You don't have any previous interview Feedback</h2>
//         </div>
//     )
// }

// export default Feedback

import { api } from "@/convex/_generated/api";
import { UserContext } from "@/app/_context/UserContext";
import { useConvex } from "convex/react";
import React, { useContext, useEffect, useState } from "react";
import { ExpertsList } from "@/services/Options";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import moment from "moment";
import Link from "next/link";


export default function Feedback() {

    const convex = useConvex();
    const { userData } = useContext(UserContext);
    const [discussionRoomList, setDiscussionRoomList] = useState([]);

    useEffect(() => {
        userData && GetDiscussionRooms();
    }, [userData])

    const GetDiscussionRooms = async () => {
        const result = await convex.query(api.DiscussionRoom.GetAllDiscussionRoom, {
            uid: userData?._id
        });
        console.log(result);
        setDiscussionRoomList(result);
    }
    const GetAbstractImages = (option) => {
        const coachingOption = ExpertsList.find((item) => item.name == option);

        return coachingOption?.abstract ?? '/ab1.png';

    }
    return (
        <div>
            <h2 className="font-bold text-xl">Feedback</h2>

            {discussionRoomList?.length == 0 && <h2 className="text-gray-400">You don't have any previous Feedback</h2>}

            <div className='mt-5'>
                {discussionRoomList.map((item, index) => (item.coachingOption == 'Mock Interview' || item.coachingOption == 'Ques Ans Prep') &&
                    (
                        <div key={index} className='border-b-[1px] pb-3 mb-4 group flex justify-between items-center cursor-pointer'>
                            <div className='flex gap-7 items-center'>
                                <Image src={GetAbstractImages(item.coachingOption)} alt='abstract'
                                    width={70} height={70} className='rounded-full h-[50px] w-[50px]' />
                                <div>
                                    <h2 className='font-bold'>{item.topic}</h2>
                                    <h2 className='text-gray-400'>{item.coachingOption}</h2>
                                    <h2 className='text-gray-400 text-sm'>{moment(item._creationTime).fromNow()}</h2>
                                </div>
                            </div>
                            <Link href={'/view-summery/' + item._id}>
                                <Button variant='outline' className='invisible group-hover:visible'>View Feedback</Button>
                            </Link>
                        </div>
                    ))}
            </div>

        </div>
    );
}

