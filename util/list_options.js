const buildListOptions = (args) => {
    var from = 0;
    if (args.page > 0) {
        from = args.page * args.pageSize;
    }

    if (args.sortBy === "" || args.sortBy === undefined)
        args.sortBy = "name";

    var options = {
        "limit": args.pageSize,
        "skip": from
    }

    //Sort
    //  1 -> asc
    // -1 -> desc
    let mySort = { };
    mySort[args.sortBy] =
    args.sortDirection === "" ||
    args.sortDirection === undefined ||
    args.sortDirection === "ascending" ||
    args.sortDirection === "asc" ? 1 : -1;

    let search = args.search.join(' ');
    const myFind = search !== "" ? { $text: { $search: search } } : {};
    //console.log(myFind);

    return {
        sort: mySort,
        find: myFind,
        options: options
    };
}

exports.buildListOptions = buildListOptions;