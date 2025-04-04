import { useEffect, useState, useRef } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    TextField,
    Pagination,
    Button,
    Modal,
    Box,
    Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import SongService from "../../services/song.service.js";

function Songs() {
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const limit = 5;
    const navigate = useNavigate();
    const tableRef = useRef(null);

    const fetchSongs = async (currentPage, query) => {
        try {
            const { data, total } = await SongService.getAllSongs(currentPage, limit, query);
            setSongs(data);
            setTotalPages(Math.ceil(total / limit));
        } catch (error) {
            toast.error("Lỗi khi lấy danh sách bài hát");
        }
    };

    useEffect(() => {
        fetchSongs(page, searchQuery);
    }, [page, searchQuery]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handleOpenModal = (songId) => {
        const song = songs.find((song) => song.id === songId);
        setSelectedSong(song);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleMakePublic = async () => {
        if (!selectedSong) return;

        try {
            await SongService.updateSong(selectedSong.id, { isPublic: true });
            setSongs((prevSongs) =>
                prevSongs.map((song) =>
                    song.id === selectedSong.id ? { ...song, isPublic: true } : song
                )
            );
            toast.success("Đã công khai bài hát thành công");
            setOpenModal(false);
        } catch (error) {
            toast.error("Lỗi khi công khai bài hát");
        }
    };

    const handleMakePrivate = async (songId) => {
        const scrollPosition = tableRef.current?.scrollTop || 0;

        try {
            const response = await SongService.updateSong(songId, { isPublic: false });
            setSongs((prevSongs) =>
                prevSongs.map((song) =>
                    song.id === songId ? { ...song, isPublic: false } : song
                )
            );
            toast.success("Đã chuyển bài hát về trạng thái lưu trữ");

            setTimeout(() => {
                if (tableRef.current) {
                    tableRef.current.scrollTop = scrollPosition;
                }
            }, 0);
        } catch (error) {
            toast.error("Lỗi khi chuyển bài hát về trạng thái lưu trữ");
        }
    };

    return (
        <div>
            <Card>
                <CardHeader title="Khúc Về Ngụ Cười" sx={{ textAlign: "center" }} />
                <CardContent>
                    <div className="row align-items-center mb-3">
                        <div className="col-md-4">
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Tìm kiếm..."
                                size="small"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <Link to="/songs/create">
                                <Button variant="contained" color="primary">
                                    Đăng ký bài hát
                                </Button>
                            </Link>
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{ marginLeft: "10px" }}
                            >
                                Phát nhạc
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardContent style={{ maxHeight: "400px", overflowY: "auto" }} ref={tableRef}>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th style={{ width: "5%", textAlign: "center" }}>STT</th>
                            <th style={{ width: "20%", textAlign: "center" }}>Tên bài hát</th>
                            <th style={{ width: "20%", textAlign: "center" }}>Ca Sĩ</th>
                            <th style={{ width: "15%", textAlign: "center" }}>Thời gian phát</th>
                            <th style={{ width: "15%", textAlign: "center" }}>Số lượt yêu thích</th>
                            <th style={{ width: "15%", textAlign: "center" }}>Trạng thái</th>
                            <th style={{ width: "10%", textAlign: "center" }}>Chức năng</th>
                        </tr>
                        </thead>
                        <tbody>
                        {songs.map((song, index) => (
                            <tr key={song.id}>
                                <td style={{ textAlign: "center" }}>
                                    {(page - 1) * limit + index + 1}
                                </td>
                                <td>{song.name || "N/A"}</td>
                                <td>{song.artist || "N/A"}</td>
                                <td style={{ textAlign: "center" }}>{song.duration || "N/A"}</td>
                                <td style={{ textAlign: "center" }}>{song.likes || 0}</td>
                                <td style={{ textAlign: "center" }}>
                                    {song.isPublic ? "Công khai" : "Lưu trữ"}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    {!song.isPublic ? (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleOpenModal(song.id)}
                                        >
                                            Công khai
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            onClick={() => handleMakePrivate(song.id)}
                                        >
                                            Ẩn
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </CardContent>
                <CardContent>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        style={{ display: "flex", justifyContent: "center" }}
                    />
                </CardContent>
            </Card>


            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Xác nhận công khai bài hát
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        Bạn có chắc chắn muốn công khai bài hát{" "}
                        <strong>{selectedSong?.name}</strong> không?
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleMakePublic}
                        >
                            Xác nhận
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCloseModal}
                        >
                            Hủy
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default Songs;
