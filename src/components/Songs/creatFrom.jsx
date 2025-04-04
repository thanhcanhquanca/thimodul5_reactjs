import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import SongService from "../../services/song.service.js";

function CreateForm() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            artist: "",
            composer: "",
            duration: "",
            status: "Lưu trữ",
            isPublic: false,
            likes: 0,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Tên bài hát là bắt buộc"),
            artist: Yup.string().required("Ca sĩ là bắt buộc"),
            composer: Yup.string().required("Nhạc sĩ là bắt buộc"),
            duration: Yup.string()
                .required("Thời gian phát là bắt buộc")
                .matches(/^\d{1,2}:\d{2}$/, "Thời gian phát phải có định dạng mm:ss"),
        }),
        onSubmit: async (values) => {
            try {
                const songData = {
                    ...values,
                    isPublic: values.status === "Lưu trữ và công khai",
                    likes: 0,
                };
                console.log("Dữ liệu gửi lên:", songData);
                await SongService.createSong(songData);
                toast.success("Thêm bài hát thành công");
                navigate("/songs");
            } catch (error) {
                console.log("Lỗi từ server:", error.response);
                toast.error("Lỗi khi thêm bài hát");
            }
        },
    });

    return (
        <Box display="flex" justifyContent="center" mt={3}>
            <Card sx={{ width: 500, p: 3 }}>
                <CardHeader title="Đăng ký bài hát" sx={{ textAlign: "center" }} />
                <CardContent>
                    <Box
                        component="form"
                        autoComplete="off"
                        onSubmit={formik.handleSubmit}
                    >
                        <Stack spacing={2}>
                            <TextField
                                label="Tên bài hát"
                                name="name"
                                type="text"
                                fullWidth
                                required
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                            <TextField
                                label="Ca sĩ"
                                name="artist"
                                type="text"
                                fullWidth
                                required
                                value={formik.values.artist}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.artist && Boolean(formik.errors.artist)}
                                helperText={formik.touched.artist && formik.errors.artist}
                            />
                            <TextField
                                label="Nhạc sĩ"
                                name="composer"
                                type="text"
                                fullWidth
                                required
                                value={formik.values.composer}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.composer && Boolean(formik.errors.composer)}
                                helperText={formik.touched.composer && formik.errors.composer}
                            />
                            <TextField
                                label="Thời gian phát (mm:ss)"
                                name="duration"
                                type="text"
                                placeholder="mm:ss"
                                fullWidth
                                required
                                value={formik.values.duration}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.duration && Boolean(formik.errors.duration)}
                                helperText={formik.touched.duration && formik.errors.duration}
                            />

                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Đăng ký
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default CreateForm;