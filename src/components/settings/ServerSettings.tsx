import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface ServerSettingsProps {
  open: boolean;
  onClose?: () => void;
}

export function ServerSettings({ open, onClose }: ServerSettingsProps) {
  const { login } = useAuth();
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login({ url, username, password });
      if (success) {
        onClose?.();
      } else {
        setError('接続に失敗しました。サーバーURL、ユーザー名、パスワードを確認してください。');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Navidromeサーバー設定</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="サーバーURL"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-navidrome-server.com"
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="ユーザー名"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {onClose && (
            <Button onClick={onClose} disabled={loading}>
              キャンセル
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            接続
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
