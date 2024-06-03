import React from 'react'
import Hero from "../components/Hero"
import Biography from "../components/Biography"
import MessageForm from "../components/MessageForm"
import Departments from "../components/Departments"

import heroImg from "../assets/hero.png"
import aboutImg from "../assets/about.png"

const Home = () => {
    return (
        <>
            <Hero
                title={
                    "Welcome to ZeeCare Medical Institute | Your Trusted Healthcare Provider"
                }
                imageUrl={heroImg}
            />
            <Biography imageUrl={aboutImg} />
            <Departments />
            <MessageForm />
        </>
    )
}

export default Home