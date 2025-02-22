import { useState } from 'react';
import { 
  TextField, 
  Box,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const SearchBar = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // If search term is empty, fetch all products
      if (!searchTerm.trim()) {
        const response = await axios.get('http://localhost:3000/api/products');
        console.log('All products:', response.data);
        onSearchResults(response.data);
      } else {
        // Updated URL structure to match backend route
        const searchUrl = `http://localhost:3000/api/products/search/${searchType}`;
        console.log('Search URL:', searchUrl);
        
        const response = await axios.get(searchUrl, {
          params: {
            [searchType]: searchTerm.trim()
          }
        });
        
        console.log('Search results:', response.data);
        onSearchResults(response.data);
      }
    } catch (err) {
      console.error('Detailed error:', err.response || err);
      setError(err.response?.data?.error || 'Error fetching products');
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box 
        component="form" 
        onSubmit={handleSearch}
        sx={{ 
          display: 'flex', 
          gap: 2, 
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Search By</InputLabel>
          <Select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            label="Search By"
            size="small"
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="description">Description</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search by ${searchType}...`}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {loading && (
        <Typography align="center" sx={{ mt: 2 }}>
          Searching...
        </Typography>
      )}
    </Box>
  );
};

export default SearchBar; 