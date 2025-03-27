
import UpdateSlider from '../components/updateSlider'

async function page({params}:{params:Promise<{id:string}>}) {
    let id=(await (params)).id
  return (
    <UpdateSlider id={id}/>
  )
}

export default page