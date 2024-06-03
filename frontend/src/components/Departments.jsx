import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import pediaImg from "../assets/departments/pedia.jpg"
import orthoImg from "../assets/departments/ortho.jpg"
import cardioImg from "../assets/departments/cardio.jpg"
import neuroImg from "../assets/departments/neuro.jpg"
import oncoImg from "../assets/departments/onco.jpg"
import radioImg from "../assets/departments/radio.jpg"
import therapyImg from "../assets/departments/therapy.jpg"
import dermaImg from "../assets/departments/derma.jpg"
import entImg from "../assets/departments/ent.jpg"

const Departments = () => {
    const departmentsArray = [
        {
            name: "Pediatrics",
            imageUrl: pediaImg,
        },
        {
            name: "Orthopedics",
            imageUrl: orthoImg,
        },
        {
            name: "Cardiology",
            imageUrl: cardioImg,
        },
        {
            name: "Neurology",
            imageUrl: neuroImg,
        },
        {
            name: "Oncology",
            imageUrl: oncoImg,
        },
        {
            name: "Radiology",
            imageUrl: radioImg,
        },
        {
            name: "Physical Therapy",
            imageUrl: therapyImg,
        },
        {
            name: "Dermatology",
            imageUrl: dermaImg,
        },
        {
            name: "ENT",
            imageUrl: entImg,
        },
    ];

    const responsive = {
        extraLarge: {
            breakpoint: { max: 3000, min: 1324 },
            items: 4,
            slidesToSlide: 1,
        },
        large: {
            breakpoint: { max: 1324, min: 1005 },
            items: 3,
            slidesToSlide: 1,
        },
        medium: {
            breakpoint: { max: 1005, min: 700 },
            items: 2,
            slidesToSlide: 1,
        },
        small: {
            breakpoint: { max: 700, min: 0 },
            items: 1,
            slidesToSlide: 1,
        },
    };

    return (
        <>
            <div className="container departments">
                <h2>Departments</h2>
                <Carousel
                    responsive={responsive}
                    removeArrowOnDeviceType={[
                        "tablet",
                        "mobile",
                    ]}
                >
                    {departmentsArray.map((depart, index) => {
                        return (
                            <div key={index} className="card">
                                <div className="depart-name">{depart.name}</div>
                                <img src={depart.imageUrl} alt="Department" />
                            </div>
                        );
                    })}
                </Carousel>
            </div>
        </>
    )
}

export default Departments