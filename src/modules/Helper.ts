
export const slugify = (title: string, separator: string = "-") => {
    // Convert all dashes/underscores into separator
    let flip = separator == "-" ? "_" : "-";

    title = title.replace(flip, separator);

    // Remove all characters that are not the separator, letters, numbers, or whitespace.
    title = title
        .toLowerCase()
        .replace(new RegExp("[^a-z0-9" + separator + "\\s]", "g"), "");

    // Replace all separator characters and whitespace by a single separator
    title = title.replace(new RegExp("[" + separator + "\\s]+", "g"), separator);

    return title.replace(
        new RegExp("^[" + separator + "\\s]+|[" + separator + "\\s]+$", "g"),
        ""
    );
}
