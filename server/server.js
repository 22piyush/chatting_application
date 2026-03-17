import app from './app.js';
import connectDB from './config/db.js';

// connect DB first
connectDB();
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
