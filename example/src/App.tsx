
import {Suspense} from "react"
import Form1 from './components/Form1'
import Form2 from './components/Form2'
import Form3 from './components/Form3'

export default function App() {
  return (
    <>
    <Suspense fallback={<p>loading...</p>}> 
      {/* <h1>Form 1</h1>
      <Form1 />
      <h1>Form 2</h1>
      <Form2 /> */}
      <h1>Form 3</h1>
      <Form3 />
      </Suspense>
    </>
  )
}
