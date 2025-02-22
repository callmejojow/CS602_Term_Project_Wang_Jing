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
  Typography,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const SearchBar = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Starting search with:', { searchType, searchTerm }); // Debug log

    try {
      if (!searchTerm.trim()) {
        console.log('Empty search term, fetching all products');
        const response = await axios.get('http://localhost:3000/api/products');
        console.log('All products:', response.data);
        onSearchResults(response.data);
        setIsFiltered(false);
      } else {
        console.log(`Searching by ${searchType}:`, searchTerm.trim());
        const response = await axios.get('http://localhost:3000/api/products/search', {
          params: {
            [searchType]: searchTerm.trim()
          }
        });
        
        console.log('Search results:', response.data);
        onSearchResults(response.data);
        setIsFiltered(true);
      }
    } catch (err) {
      console.error('Search error:', err.response || err);
      setError(err.response?.data?.error || 'Error searching products');
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm('');
    setIsFiltered(false);
    setError(null);
    setLoading(true);
    
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      onSearchResults(response.data);
    } catch (err) {
      console.error('Error fetching all products:', err);
      setError('Error fetching products');
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
          maxWidth: 800,
          mx: 'auto'
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
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

      {/* Error Message */}
      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Loading Message */}
      {loading && (
        <Typography align="center" sx={{ mt: 2 }}>
          Searching...
        </Typography>
      )}

      {/* Back to All Products button */}
      {isFiltered && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            onClick={handleClearSearch}
            color="primary"
          >
            Back to All Products
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar; 