import React, { useContext } from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct';
import HorizontalCardProduct from '../components/HorizontalCardProduct';
import VerticalCardProduct from '../components/VerticalCardProduct';

const Home = () => {

    return (
        <div>
            <CategoryList />
            <BannerProduct />
            <HorizontalCardProduct category={"airpods"} heading={"Airpods"} />
            <HorizontalCardProduct category={"camera"} heading={"Camera"} />

            <VerticalCardProduct category={"earphones"} heading={"Earphones"} />
            <VerticalCardProduct category={"mobiles"} heading={"Mobiles"} />
            <VerticalCardProduct category={"mouse"} heading={"Mouse"} />
            <VerticalCardProduct category={"printers"} heading={"Printers"} />
            <VerticalCardProduct category={"processor"} heading={"Processor"} />
            <VerticalCardProduct category={"refrigerator"} heading={"Refrigerator"} />
            <VerticalCardProduct category={"speakers"} heading={"Speakers"} />
            <VerticalCardProduct category={"trimmers"} heading={"Trimmers"} />
            <VerticalCardProduct category={"televisions"} heading={"Televisions"} />
            <VerticalCardProduct category={"watches"} heading={"Watches"} />



        </div>
    )
}

export default Home
