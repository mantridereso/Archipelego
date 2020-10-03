<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 24.09.15
 * Time: 17:23
 */

namespace SVB\CBS\ShippingWorldBundle\Model;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Class Village
 * @package SVB\CBS\ShippingWorldBundle\Model
 *
 * @OGM\Entity(labels="Village")
 */
class Village implements VillageInterface
{

    /**
     * @OGM\Auto
     */
    private $id;

    /**
     * @var string
     *
     * @OGM\Property
     * @OGM\Index
     */
    private $name;

    /**
     * @var IslandInterface
     * @OGM\ManyToOne(relation="situated_on_island")
     */
    private $island;

    /**
     * @var LibrarianInterface
     * @OGM\ManyToOne(relation="librarian_of",direction="to")
     */
    private $librarian;

    /**
     * @var int
     *
     * @OGM\Property
     */
    private $corner;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return Village
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return IslandInterface
     */
    public function getIsland()
    {
        return $this->island;
    }

    /**
     * @param $bookTitle
     * @return BookInterface
     */
    public function getLibraryBook($bookTitle)
    {
        // TODO: Implement getLibraryBook() method.
        throw new \RuntimeException("getLibraryBook(\$bookTitle) : NOT IMPLEMENTED YET :-(");
    }

    /**
     * @return LibrarianInterface
     */
    public function getLibrarian()
    {
        return $this->librarian;
    }

    /**
     * @param IslandInterface $island
     * @return Village
     */
    public function setIsland(IslandInterface $island)
    {
        $this->island = $island;
        return $this;
    }

    /**
     * @param LibrarianInterface $librarian
     * @return Village
     */
    public function setLibrarian(LibrarianInterface $librarian)
    {
        $this->librarian = $librarian;
        return $this;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return Village
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return int
     */
    public function getCorner()
    {
        return $this->corner;
    }

    /**
     * @param int $corner
     * @return Village
     */
    public function setCorner($corner)
    {
        $this->corner = $corner;
        return $this;
    }

    /**
     * @return Village
     */
    public static function create(){
        return new Village();
    }

    /**
     * @return array
     */
    public function export()
    {
        return [
            'name' => $this->getName(),
            'island' => $this->getIsland()->getName(),
            'corner' => $this->getCorner()
        ];
    }
}