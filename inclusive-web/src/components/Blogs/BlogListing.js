import React from "react";
import {baseUrl} from '../../urlConstants';
import {
    makeStyles,
    Grid,
    Typography,
    Chip
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Loader from '../../assets/loader/loader';
import {Link} from 'react-router-dom'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
    bContainer:{
        width: "100%",
        backgroundColor: "#fafafa",
        paddingTop: "12px"
    },
    mainContainer: {
        maxWidth: "1100px",
        width: "auto",
        margin : "0px auto",
    },
    imgContainer: {
        width: "180px",
        minWidth: "180px",
    },
    detailsContainer: {
        width: "calc(100% - 180px)",
        padding: "0px 10px"
    },
    tileContainer:{
        padding: "10px",
        minWidth: "200px"
    },
    tile: {
        backgroundColor: "#fff",
        // width: "calc(100% - 20px)",
        marginBottom: "12px",
        padding: "30px 20px 20px 20px",
        borderRadius: "5px",
        boxShadow: "0px 0px 63px -41px rgba(0, 0, 0, 0.25)"
    },
    img:{
        maxWidth: "158px",
        maxHeight: "158px",
        borderRadius: "5px"
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    ellipsis: {
        lineHeight: "1.5em",
        maxHeight: "4.5em",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "100%",
        display: "-webkit-box",
        "-webkit-box-orient": "vertical",
        "-webkit-line-clamp": 3,
        lineClamp: 3,
    },
    description:{
        marginTop: "8px"
    },
    tileLink:{
        color: "inherit",
        width: "100%"
    },
    chipContainer:{
        padding: "0px 10px 0px 10px"
    },
    chip: {
        borderRadius: "5px",
        marginRight: "12px",
        marginTop: "10px",
        fontWeight :"600",
        background: "#e6e6e6"
    }
}))

function BlogListing(props) {
    const classes = useStyles()
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [storyData, setStoryData] = React.useState({})
    
    const getStoryData = async () => {
        let key = localStorage.getItem("key");
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `token ${key}`,
          },
        };

        const response = await fetch(`${baseUrl}/upskill/blog/get/`, requestOptions)
                                .then(response => response.json());
        console.log(response);
        if(response.status === "error"){
            setError(response.message)
        } else {
            setStoryData(response.data);
        }
        setLoading(false);
    }

    
    React.useEffect(() => {
        getStoryData()
    },[])

    React.useEffect(() => {
        console.log(storyData)
    },[storyData])

    return (
        <>
        {loading ? 
            <Grid>
                <Loader loading={loading} />
            </Grid>  
        :
            error ? 
                <Grid>{error}</Grid>
            : 
            <Grid container justify='center' className={classes.bContainer}>
                <Grid item container className={classes.mainContainer} alignItems='flex-start' justify="space-evenly">
                    <Grid item style={{flex: "2 2 calc(100% - 390px)"}} className={classes.tileContainer}>
                        {storyData.map((story) => {
                            return (
                                <Grid item container key={story.id} className={classes.tile}>    
                                    <Link to={`/home/blog/${story.id}`} key={story.id} className={classes.tileLink}>
                                        <Grid item container xs={12}>
                                            <Grid item container justify={'center'} alignItems={'flex-start'} className={classes.imgContainer}>
                                                <img className={classes.img} src={story.photo_url} style={{width: "100%"}} alt={story.name} />
                                            </Grid>
                                            <Grid item className={classes.detailsContainer}>
                                                <Grid item container>
                                                    <Typography className={classes.ellipsis} variant="h5" style={{fontWeight: "600"}}>{story.name}</Typography>
                                                </Grid>
                                                <Grid item container className={classes.description}>
                                                    <Typography className={classes.ellipsis} variant="body2">{story.description}</Typography>
                                                </Grid>
                                                <Grid item container justify='flex-end' className={classes.description}>
                                                    <Typography variant="body2" style={{fontWeight: "600"}}>-{story.author_credits}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {story.tags.length && 
                                        <Grid className={classes.chipContainer}>
                                            {story.tags.map((tag) => {
                                                return(
                                                    <Chip
                                                        key={tag.id}
                                                        label = {tag.name}
                                                        className={classes.chip}
                                                    />
                                                )
                                            })}
                                        </Grid>}
                                    </Link>
                                </Grid>
                            )
                        })}
                    </Grid>
                    <Grid item className={clsx(classes.rightElements,classes.tileContainer)} style={{flex: "1 1 390px"}}>
                        <Grid item container className={classes.tile}>
                            <Typography variant="body1" style={{fontWeight: "600"}}>
                                Blogs section helps you keep updated with skills and technologies required to get in most of the companies.
                            </Typography>
                        </Grid>
                        <Grid item container className={classes.tile}>
                            <Typography variant="body1" style={{fontWeight: "600"}} >
                                Sort Blogs By
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        } 
        </>
    )
}

export default BlogListing;