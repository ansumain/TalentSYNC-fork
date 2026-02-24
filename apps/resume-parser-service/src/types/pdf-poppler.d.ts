declare module 'pdf-poppler' {
    interface ConvertOptions {
        format?: 'jpeg' | 'png' | 'tiff';
        out_dir?: string;
        out_prefix?: string;
        page?: number | null;
        dpi?: number;
    }

    function convert(
        file: string,
        options?: ConvertOptions
    ): Promise<void>;

    export default { convert };

}
