import React, { useEffect, useState } from 'react';
import Footer from '../components/common/Footer';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux";
import Error from "./Error";
import Spinner from '../components/common/Spinner';

const Catalog = () => {
    const { loading } = useSelector((state) => state.profile);
    const { catalogName } = useParams();
    const [active, setActive] = useState(1);
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    // Fetch all categories
    useEffect(() => {
        const getCategories = async () => {
            try {
                console.log("Fetching categories for catalogName:", catalogName);
                const res = await apiConnector("GET", categories.CATEGORIES_API);
                console.log("Categories API response:", res);

                const transformedCatalogName = catalogName.split(" ").join("-").toLowerCase();
                console.log("Transformed catalogName:", transformedCatalogName);

                const category = res?.data?.data?.find(
                    (ct) => {
                        const transformedCategoryName = ct.name.split(" ").join("-").toLowerCase();
                        console.log(`Comparing with category name: ${transformedCategoryName}`);
                        return transformedCategoryName === transformedCatalogName;
                    }
                );
                const category_id = category?._id;

                console.log("Resolved category_id:", category_id);
                if (!category_id) {
                    throw new Error("Category not found");
                }
                setCategoryId(category_id);
            } catch (error) {
                console.error("Error fetching category ID:", error.message);
            }
        };
        getCategories();
    }, [catalogName]);

    // Fetch category details
    useEffect(() => {
        const getCategoryDetails = async () => {
            try {
                if (categoryId) {
                    console.log("Fetching category details for categoryId:", categoryId);
                    const res = await getCatalogaPageData(categoryId);
                    console.log("Category Page Data Response:", res);
                    setCatalogPageData(res);
                    console.log("ye dekhle bhai",res.data.mostSellingCourses)
                }
            } catch (error) {
                console.error("Error fetching category details:", error.message);
            }
        };
        if (categoryId) {
            getCategoryDetails();
        }
    }, [categoryId]);

    if (loading || !catalogPageData) {
        return (
            <div  className=' flex items-center justify-center h-[90vh] '><Spinner/></div>
        );
    }

    if (!loading && !catalogPageData.success) {
        return <Error />;
    }

    return (
        <>
            {/* Hero Section */}
            <div className="box-content bg-richblack-800 px-4">
                <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
                    <p className="text-sm text-richblack-300">
                        {`Home / Catalog / `}
                        <span className="text-yellow-25">
                            {catalogPageData?.data?.selectedCategory?.name}
                        </span>
                    </p>
                    <p className="text-3xl text-richblack-5">
                        {catalogPageData?.data?.selectedCategory?.name}
                    </p>
                    <p className="max-w-[870px] text-richblack-200">
                        {catalogPageData?.data?.selectedCategory?.description}
                    </p>
                </div>
            </div>

            {/* Section 1 */}
            <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading text-3xl text-caribbeangreen-300 font-bold">Courses to get you started</div>
                <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p
                        className={`px-4 py-2 ${
                            active === 1
                                ? "border-b border-b-yellow-25 text-yellow-25"
                                : "text-richblack-50"
                        } cursor-pointer`}
                        onClick={() => setActive(1)}
                    >
                        Most Popular
                    </p>
                    <p
                        className={`px-4 py-2 ${
                            active === 2
                                ? "border-b border-b-yellow-25 text-yellow-25"
                                : "text-richblack-50"
                        } cursor-pointer`}
                        onClick={() => setActive(2)}
                    >
                        New
                    </p>
                </div>
                <div>
                    <CourseSlider
                        Courses={catalogPageData?.data?.selectedCategory?.courses}
                    />
                </div>
            </div>

            {/* Section 2 */}
            <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading text-2xl text-yellow-200 font-bold">
                    Top courses in {catalogPageData?.data?.differentCategory?.name}
                </div>
                <div className="py-8">
                    <CourseSlider
                        Courses={catalogPageData?.data?.differentCategory?.courses}
                    />
                </div>
            </div>

            {/* Section 3 */}
            <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading text-2xl text-yellow-200 font-bold">Frequently Bought</div>
                <div className="py-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {catalogPageData?.data?.mostSellingCourses
                            ?.slice(0, 4)
                            .map((course, i) => (
                                <Course_Card course={course} key={i} Height={"h-[400px]"} />
                            ))}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Catalog;