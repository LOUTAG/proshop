const Spinner = ()=>{
    return(
        <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full z-10">
            <div className="h-20 w-20 border-8 rounded-full border-transparent border-b-black border-l-black animate-spin"></div>
        </div>
    )
}

export default Spinner;