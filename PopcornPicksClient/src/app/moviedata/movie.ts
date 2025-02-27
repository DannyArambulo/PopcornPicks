export interface Genre
{
    id: number;
    name: string;
}

export interface Video
{
    type: string;
    key: string;
}

export interface Movie 
{
    id: number;
    title: string;
    release_date: string;
    overview: string;
    poster_path: string;
    genres: Genre[];
    videos: {results: Video[]};
}
