// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { UserButton } from "@stackframe/stack";

// export default function Home() {
//   return (
//     <div>
//       <h2>
//         Hello Yashaswini
//       </h2>

//       <Button variant={'destructive'}>Yashu</Button>
//       <UserButton/>
//     </div>
//   );
// }

// import Image from "next/image";
import { Button } from "@/components/ui/button";

import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h2>
        Hello Yashaswini
      </h2>

      <Button variant="destructive">Yashu</Button>
      <UserButton />
    </div>
  );
}
