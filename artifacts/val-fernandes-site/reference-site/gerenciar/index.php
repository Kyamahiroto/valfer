<?php
/**
 * Painel Administrativo do Site Val Fernandes
 * Altere a senha abaixo para a sua segurança antes de colocar em produção.
 */
// Hash Bcrypt da senha padrão 'val2026'
const ADMIN_USER = 'valfernandes';
const ADMIN_PASSWORD = '$2y$10$p3qo1aUIoIJaRqYo.VT5pOaxiXzaj3XbjvOczpxzIT7iujQR2ObvO';

// Helper de criptografia para o administrador gerar uma senha segura
if (isset($_GET['gerar_hash']) && !empty($_GET['gerar_hash'])) {
    header('Content-Type: text/html; charset=utf-8');
    $pass = $_GET['gerar_hash'];
    $hash = password_hash($pass, PASSWORD_DEFAULT);
    echo "<body style='background:#080d20; color:#fff; font-family:sans-serif; padding:40px; text-align:center;'>";
    echo "<div style='display:inline-block; background:#121932; border:1px solid #27304b; padding:30px; border-radius:12px; max-width:600px;'>";
    echo "<h2 style='color:#d4a42b; margin-top:0;'>Gerador de Senha Segura (Hash)</h2>";
    echo "<p style='color:#a9afbf; font-size:14px;'>Para maior segurança, copie o hash abaixo e substitua o valor de <code>ADMIN_PASSWORD</code> no arquivo <code>gerenciar/index.php</code>:</p>";
    echo "<input value='" . htmlspecialchars($hash, ENT_QUOTES) . "' style='width:100%; padding:12px; background:#080d20; color:#fff; border:1px solid #27304b; border-radius:6px; font-family:monospace; font-size:14px; margin-bottom:20px;' readonly onclick='this.select()'>";
    echo "<p style='font-size:12px; color:#d4a42b;'>Dica: Clique no campo acima para selecionar e copie (Ctrl+C)!</p>";
    echo "</div>";
    echo "</body>";
    exit;
}

session_start();
$root = dirname(__DIR__);
$contentDir = $root . '/content';
$postsFile = $contentDir . '/posts.json';
$settingsFile = $contentDir . '/settings.json';

if (!is_dir($contentDir)) {
    mkdir($contentDir, 0755, true);
}

if (!file_exists($postsFile)) {
    file_put_contents($postsFile, json_encode(['posts' => []], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

if (!file_exists($settingsFile)) {
    $defaultSettings = [
        'instagramUrl' => 'https://www.instagram.com/valfernandes.oficial/',
        'whatsappUrl' => 'https://wa.me/5565992199578',
        'phone' => '(65) 99219-9578',
        'address' => 'Av. Historiador Rubens de Mendonça, 1856 - Sl 903 - Bosque da Saude, Cuiabá - MT, 78050-000',
        'googleReviewUrl' => 'https://www.google.com/search?kgmid=/g/11sx55mvh5&hl=pt-BR&q=Val+Fernandes+-+Psicanalista+e+Hipnoterapeuta+Cl%C3%ADnica&shem=epsd1,ltae,rimspwouoe&shndl=30&source=sh/x/loc/osrp/m1/5&kgs=82d8ba166cf5e852&utm_source=epsd1,ltae,rimspwouoe,sh/x/loc/osrp/m1/5#lrd=0x939db1f137097909:0xf1b8435fdf18c9ee,1,,,,',
        'headTags' => '',
        'bodyTags' => ''
    ];
    file_put_contents($settingsFile, json_encode($defaultSettings, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function readJson($file, $fallback) {
    if (!file_exists($file)) return $fallback;
    $d = json_decode(file_get_contents($file), true);
    return is_array($d) ? $d : $fallback;
}

function h($s) {
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

function sanitizeFileName($filename) {
    return preg_replace('/[^a-zA-Z0-9._-]/', '_', $filename);
}

// Process Login
if (isset($_POST['login'])) {
    $enteredUser = trim($_POST['username'] ?? '');
    $enteredPass = $_POST['password'] ?? '';
    
    if (hash_equals(ADMIN_USER, $enteredUser)) {
        $isHash = (strpos(ADMIN_PASSWORD, '$2y$') === 0 && strlen(ADMIN_PASSWORD) === 60);
        $isValid = $isHash 
            ? password_verify($enteredPass, ADMIN_PASSWORD) 
            : hash_equals(ADMIN_PASSWORD, $enteredPass);
            
        if ($isValid) {
            $_SESSION['admin'] = true;
        } else {
            $loginError = 'Usuário ou senha incorretos. Verifique suas credenciais.';
        }
    } else {
        $loginError = 'Usuário ou senha incorretos. Verifique suas credenciais.';
    }
}

// Process Logout
if (isset($_GET['sair'])) {
    session_destroy();
    header('Location: /gerenciar/');
    exit;
}

// Render Login Page if not authenticated
if (empty($_SESSION['admin'])) {
?>
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gerenciar Conteúdo | Val Fernandes</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; display: grid; place-items: center; min-height: 100vh; background: #080d20; color: #fff; font-family: 'Manrope', sans-serif; }
    form { width: min(380px, 90vw); padding: 36px; background: #121932; border: 1px solid #27304b; border-radius: 16px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); }
    h1 { font-size: 22px; margin: 0 0 8px; color: #d4a42b; text-align: center; }
    p { font-size: 13px; color: #a9afbf; margin: 0 0 20px; text-align: center; }
    input, button { width: 100%; box-sizing: border-box; margin-top: 14px; padding: 14px; border-radius: 8px; border: 1px solid #27304b; font-size: 14px; }
    input { background: #080d20; color: #fff; }
    button { background: linear-gradient(135deg, #f2ca61, #d4a42b); color: #17120a; border: 0; font-weight: 800; cursor: pointer; transition: opacity 0.2s; }
    button:hover { opacity: 0.9; }
    .error { color: #ff8b8b; font-size: 13px; text-align: center; margin-top: 10px; }
  </style>
</head>
<body>
  <form method="post">
    <h1>Gerenciar Conteúdo</h1>
    <p>Painel administrativo do site Val Fernandes</p>
    <?php if (isset($loginError)) echo '<div class="error">'.h($loginError).'</div>'; ?>
    <input type="text" name="username" placeholder="Nome de Usuário" required autofocus>
    <input type="password" name="password" placeholder="Digite sua senha de acesso" required>
    <button name="login" type="submit">Entrar no Painel</button>
  </form>
</body>
</html>
<?php
    exit;
}

// Authenticated Admin logic
$postsData = readJson($postsFile, ['posts' => []]);
$settingsData = readJson($settingsFile, []);
$notice = '';

// Helper to handle image upload
function handleImageUpload($root) {
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image_file']['tmp_name'];
        $fileName = $_FILES['image_file']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (in_array($fileExtension, $allowedExtensions)) {
            $uploadDir = $root . '/uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $newFileName = time() . '-' . sanitizeFileName($fileName);
            $destPath = $uploadDir . $newFileName;
            
            if (move_uploaded_file($fileTmpPath, $destPath)) {
                return '/uploads/' . $newFileName;
            }
        }
    }
    return null;
}

// Save Settings Form
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_settings'])) {
    $settingsData['instagramUrl'] = trim($_POST['instagramUrl'] ?? '');
    $settingsData['whatsappUrl'] = trim($_POST['whatsappUrl'] ?? '');
    $settingsData['phone'] = trim($_POST['phone'] ?? '');
    $settingsData['address'] = trim($_POST['address'] ?? '');
    $settingsData['googleReviewUrl'] = trim($_POST['googleReviewUrl'] ?? '');
    $settingsData['headTags'] = $_POST['headTags'] ?? '';
    $settingsData['bodyTags'] = $_POST['bodyTags'] ?? '';

    file_put_contents($settingsFile, json_encode($settingsData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
    $notice = 'Configurações salvas com sucesso!';
}

// Add New Article
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_post'])) {
    $title = trim($_POST['title'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $excerpt = trim($_POST['excerpt'] ?? '');
    $content = trim($_POST['content'] ?? '');
    
    // Handle image upload or fallback to input image URL
    $uploadedImage = handleImageUpload($root);
    $image = $uploadedImage ? $uploadedImage : trim($_POST['image_url'] ?? '');

    if ($title && $excerpt) {
        $newPost = [
            'id' => time(),
            'title' => $title,
            'category' => $category ?: 'Artigo',
            'excerpt' => $excerpt,
            'content' => $content ?: $excerpt,
            'image' => $image ?: '/assets/expert2.jpeg',
            'date' => date('d/m/Y')
        ];

        array_unshift($postsData['posts'], $newPost);
        file_put_contents($postsFile, json_encode($postsData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
        $notice = 'Novo artigo publicado com sucesso!';
    } else {
        $notice = 'Por favor, preencha ao menos o Título e o Resumo do artigo.';
    }
}

// Edit Existing Article
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['edit_post'])) {
    $postId = (int)$_POST['edit_post_id'];
    $title = trim($_POST['title'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $excerpt = trim($_POST['excerpt'] ?? '');
    $content = trim($_POST['content'] ?? '');
    
    $uploadedImage = handleImageUpload($root);
    
    // Find index to edit
    $editIndex = -1;
    foreach ($postsData['posts'] as $idx => $p) {
        if ($p['id'] == $postId) {
            $editIndex = $idx;
            break;
        }
    }

    if ($editIndex !== -1 && $title && $excerpt) {
        // Keep old image if no new one uploaded/specified
        $image = $uploadedImage ? $uploadedImage : trim($_POST['image_url'] ?? '');
        if (empty($image)) {
            $image = $postsData['posts'][$editIndex]['image'];
        }

        $postsData['posts'][$editIndex]['title'] = $title;
        $postsData['posts'][$editIndex]['category'] = $category ?: 'Artigo';
        $postsData['posts'][$editIndex]['excerpt'] = $excerpt;
        $postsData['posts'][$editIndex]['content'] = $content ?: $excerpt;
        $postsData['posts'][$editIndex]['image'] = $image;

        file_put_contents($postsFile, json_encode($postsData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
        $notice = 'Artigo atualizado com sucesso!';
        
        // Redirect to clear edit state
        header('Location: /gerenciar/?notice=' . urlencode($notice));
        exit;
    }
}

// Delete Article Form
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_post_id'])) {
    $idToDelete = (int)$_POST['delete_post_id'];
    $deleteIndex = -1;
    foreach ($postsData['posts'] as $idx => $p) {
        if ($p['id'] == $idToDelete) {
            $deleteIndex = $idx;
            break;
        }
    }
    if ($deleteIndex !== -1) {
        array_splice($postsData['posts'], $deleteIndex, 1);
        file_put_contents($postsFile, json_encode($postsData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
        $notice = 'Artigo removido com sucesso!';
    }
}

// Check URL query parameters for notifications or edits
if (isset($_GET['notice'])) {
    $notice = $_GET['notice'];
}

$editPost = null;
if (isset($_GET['edit'])) {
    $editId = (int)$_GET['edit'];
    foreach ($postsData['posts'] as $p) {
        if ($p['id'] == $editId) {
            $editPost = $p;
            break;
        }
    }
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel de Controle | Val Fernandes</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Quill rich text editor -->
  <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
  
  <style>
    body { margin: 0; background: #080d20; color: #edf0f5; font-family: 'Manrope', sans-serif; font-size: 14px; }
    .wrap { max-width: 950px; margin: 40px auto; padding: 0 20px; }
    header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid #27304b; margin-bottom: 30px; }
    header h1 { margin: 0; font-size: 24px; color: #d4a42b; }
    header small { color: #a9afbf; }
    section { background: #121932; padding: 28px; border-radius: 14px; border: 1px solid #27304b; margin-bottom: 30px; }
    h2 { font-size: 18px; color: #fff; margin-top: 0; margin-bottom: 16px; border-left: 3px solid #d4a42b; padding-left: 10px; }
    label { display: block; margin-top: 14px; font-weight: 700; font-size: 13px; color: #d6dae6; }
    input, textarea, select { width: 100%; box-sizing: border-box; margin-top: 6px; padding: 12px; border: 1px solid #27304b; border-radius: 8px; background: #080d20; color: #fff; font-family: inherit; font-size: 14px; }
    textarea { min-height: 110px; resize: vertical; }
    .file-input-wrapper { display: flex; align-items: center; gap: 15px; margin-top: 6px; }
    .file-input-wrapper input[type="file"] { margin-top: 0; flex: 1; }
    .btn { padding: 10px 18px; background: #d4a42b; color: #17120a; border: 0; border-radius: 8px; font-weight: 800; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; text-align: center; }
    .btn:hover { opacity: 0.9; }
    .btn-danger { background: #8e3340; color: #fff; }
    .btn-secondary { background: #27304b; color: #fff; }
    .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 6px; }
    .notice { padding: 14px; background: rgba(212, 164, 43, 0.15); border: 1px solid #d4a42b; border-radius: 8px; color: #f2ca61; font-weight: 700; margin-bottom: 25px; }
    
    /* Search Bar & Grid View for Articles */
    .admin-posts-search { margin-bottom: 20px; }
    .posts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 10px; }
    .grid-post-card { background: #0b1124; border: 1px solid #27304b; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; transition: border-color 0.2s; }
    .grid-post-card:hover { border-color: #d4a42b; }
    .post-card-header { display: flex; gap: 12px; }
    .post-card-img { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #27304b; }
    .post-card-details { flex-grow: 1; min-width: 0; }
    .post-card-details strong { display: block; color: #fff; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .post-card-details span { font-size: 12px; color: #a9afbf; }
    .post-card-actions { display: flex; gap: 10px; justify-content: flex-end; }
    
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    @media(max-width:700px){
      .grid-2 { grid-template-columns: 1fr; }
      .posts-grid { grid-template-columns: 1fr; }
    }
    
    /* Quill Editor Custom styling */
    .editor-container { background: #080d20; color: #fff; border: 1px solid #27304b !important; border-radius: 0 0 8px 8px; min-height: 250px; }
    .ql-toolbar { background: #121932; border: 1px solid #27304b !important; border-radius: 8px 8px 0 0; }
    .ql-snow .ql-stroke { stroke: #edf0f5 !important; }
    .ql-snow .ql-fill { fill: #edf0f5 !important; }
    .ql-snow .ql-picker { color: #edf0f5 !important; }
    .ql-snow .ql-picker-options { background-color: #121932 !important; border-color: #27304b !important; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div>
        <h1>Painel de Gerenciamento</h1>
        <small>Val Fernandes — Psicanálise e Hipnoterapia</small>
      </div>
      <div>
        <a class="btn btn-secondary" href="/" target="_blank">Ver Site ↗</a>
        <a class="btn btn-danger" href="?sair=1">Sair</a>
      </div>
    </header>

    <?php if ($notice): ?>
      <div class="notice"><?= h($notice) ?></div>
    <?php endif; ?>

    <!-- Criar ou Editar Artigo -->
    <section id="form-section">
      <h2><?= $editPost ? 'Editar Artigo' : 'Publicar Novo Artigo no Blog (SEO)' ?></h2>
      <form method="post" enctype="multipart/form-data" id="post-form">
        <?php if ($editPost): ?>
          <input type="hidden" name="edit_post_id" value="<?= $editPost['id'] ?>">
        <?php endif; ?>
        
        <div class="grid-2">
          <label>Título do Artigo
            <input name="title" value="<?= $editPost ? h($editPost['title']) : '' ?>" placeholder="Ex.: Como superar a ansiedade com a hipnoterapia" required>
          </label>
          <label>Categoria
            <input name="category" value="<?= $editPost ? h($editPost['category']) : '' ?>" placeholder="Ex.: Ansiedade, Hipnoterapia, Relacionamentos">
          </label>
        </div>

        <label>Resumo (Exibido nos Cards do Site)
          <input name="excerpt" value="<?= $editPost ? h($editPost['excerpt']) : '' ?>" placeholder="Breve introdução sobre o artigo..." required>
        </label>

        <!-- Dynamic Capa Image Section -->
        <div class="grid-2">
          <label>Enviar Imagem de Capa do Dispositivo
            <div class="file-input-wrapper">
              <input type="file" name="image_file" accept="image/*">
            </div>
          </label>
          <label>Ou Link de Imagem Existente (URL)
            <input name="image_url" value="<?= $editPost ? h($editPost['image']) : '' ?>" placeholder="/assets/expert2.jpeg ou https://...">
          </label>
        </div>

        <!-- Content with Quill Editor -->
        <label style="margin-bottom:6px; display:block;">Conteúdo Completo do Artigo (Suporta Formatação)</label>
        <div id="quill-editor" class="editor-container">
          <?= $editPost ? $editPost['content'] : '' ?>
        </div>
        <input type="hidden" name="content" id="content-hidden-input">

        <div style="margin-top: 24px; display: flex; gap: 12px;">
          <?php if ($editPost): ?>
            <button class="btn" name="edit_post" type="submit">Salvar Alterações</button>
            <a href="/gerenciar/" class="btn btn-secondary">Cancelar Edição</a>
          <?php else: ?>
            <button class="btn" name="add_post" type="submit">Publicar Artigo →</button>
          <?php endif; ?>
        </div>
      </form>
    </section>

    <!-- Artigos Publicados Grid View -->
    <section>
      <h2>Artigos Publicados (<?= count($postsData['posts']) ?>)</h2>
      
      <!-- Instant Search Filter -->
      <div class="admin-posts-search">
        <input type="text" id="admin-search-input" placeholder="Buscar artigos publicados pelo título..." style="margin-top: 0;">
      </div>

      <div class="posts-grid" id="admin-posts-grid">
        <?php if (empty($postsData['posts'])): ?>
          <p style="color:#a9afbf" class="no-posts-text">Nenhum artigo cadastrado ainda.</p>
        <?php else: ?>
          <?php foreach ($postsData['posts'] as $index => $post): ?>
            <div class="grid-post-card" data-title="<?= h(strtolower($post['title'])) ?>">
              <div class="post-card-header">
                <img class="post-card-img" src="<?= h($post['image'] ?: '/assets/expert2.jpeg') ?>" alt="">
                <div class="post-card-details">
                  <strong><?= h($post['title']) ?></strong>
                  <span>Categoria: <?= h($post['category'] ?? 'Geral') ?></span><br>
                  <span>Data: <?= h($post['date']) ?></span>
                </div>
              </div>
              <div class="post-card-actions">
                <a href="?edit=<?= $post['id'] ?>#form-section" class="btn btn-secondary btn-sm">Editar</a>
                <form method="post" onsubmit="return confirm('Deseja realmente excluir este artigo?');" style="display:inline;">
                  <input type="hidden" name="delete_post_id" value="<?= $post['id'] ?>">
                  <button class="btn btn-danger btn-sm" type="submit">Excluir</button>
                </form>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </section>

    <!-- Tags do Google e Links de Contato -->
    <section>
      <h2>Tags do Google &amp; Redes Sociais</h2>
      <p style="color:#a9afbf; font-size:13px;">Cole aqui os códigos de rastreamento do Google Analytics, Tag Manager ou Google Ads.</p>

      <form method="post">
        <div class="grid-2">
          <label>Link do Instagram
            <input name="instagramUrl" value="<?= h($settingsData['instagramUrl'] ?? '') ?>">
          </label>
          <label>Link do WhatsApp
            <input name="whatsappUrl" value="<?= h($settingsData['whatsappUrl'] ?? '') ?>">
          </label>
        </div>

        <div class="grid-2">
          <label>Telefone para Exibição
            <input name="phone" value="<?= h($settingsData['phone'] ?? '') ?>">
          </label>
          <label>Link de Avaliações do Google
            <input name="googleReviewUrl" value="<?= h($settingsData['googleReviewUrl'] ?? '') ?>">
          </label>
        </div>

        <label>Endereço Completo
          <input name="address" value="<?= h($settingsData['address'] ?? '') ?>">
        </label>

        <label>Tag no &lt;head&gt; (Google Analytics / Google Tag Manager)
          <textarea name="headTags" placeholder="<!-- Cole aqui os scripts do Google Analytics / GTM -->"><?= h($settingsData['headTags'] ?? '') ?></textarea>
        </label>

        <label>Tag no &lt;body&gt; (noscript do Google Tag Manager)
          <textarea name="bodyTags" placeholder="<!-- Cole aqui os scripts do noscript do GTM -->"><?= h($settingsData['bodyTags'] ?? '') ?></textarea>
        </label>

        <button class="btn" name="save_settings" type="submit" style="margin-top: 18px;">Salvar Configurações &amp; Tags →</button>
      </form>
    </section>
  </div>

  <!-- Quill Script integration -->
  <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
  <script>
    // Initialize Quill Editor
    var quill = new Quill('#quill-editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'clean']
        ]
      }
    });

    // Populate hidden field with Quill HTML on form submit
    var form = document.getElementById('post-form');
    form.onsubmit = function() {
      var contentInput = document.getElementById('content-hidden-input');
      contentInput.value = quill.root.innerHTML;
    };

    // Client-side instant filter search for articles
    var searchInput = document.getElementById('admin-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        var query = e.target.value.toLowerCase().trim();
        var cards = document.querySelectorAll('.grid-post-card');
        var visibleCount = 0;
        
        cards.forEach(function(card) {
          var title = card.getAttribute('data-title');
          if (title.indexOf(query) !== -1) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        // Show/hide no posts text if any
        var noPostsText = document.querySelector('.no-posts-text');
        if (noPostsText) {
          noPostsText.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      });
    }
  </script>
</body>
</html>
