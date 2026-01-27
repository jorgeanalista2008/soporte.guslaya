import BestSelling from "../Components/Home/BestSelling"
import Hero from "../Components/Home/Hero"
import LatestProducts from "../Components/Home/LatestProducts"
import OurSpecs from "../Components/Home/OurSpecs"

const Home = () => {
  return (
    // Agregamos padding-top equivalente a la altura del navbar (por ejemplo 20 = 5rem)
    <div className="pt-16">
      <Hero/>
      <LatestProducts/>
      <BestSelling/>
      <OurSpecs/>
    </div>
  )
}

export default Home
