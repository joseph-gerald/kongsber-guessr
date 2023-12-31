interface Props {
    title: string;
    desc: string;
    img: string;
}

export default function Feature(props: Props) {
    const {
        title,
        desc,
        img
    } = props;
    return (
        <div className="relative inline-flex group flex-col items-center text-center text-white w-full lg:w-1/4 p-8 pt-4 rounded-2xl outfit bg-[#3F3F3F]">
            <img src={img} className="w-1/4 lg:w-1/3 p-2 m-2" />
            <h3 className="text-4xl font-semibold pb-5">
                {title}
            </h3>
            <p className="opacity-80 text-lg font-medium p-2">
                {desc}
            </p>
        </div>
    );
}