import { SignIn } from '@clerk/nextjs'


export default function Page() {
  return <SignIn path='/admin/sign-in' />
}