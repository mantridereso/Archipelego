<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 23.09.15
 * Time: 17:30
 */

namespace SVB\CBS\ShippingWorldBundle\Model;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @OGM\Entity(labels="Book")
 */
class Book implements BookInterface
{

    /**
     * @OGM\Auto
     */
    private $id;

    /**
     * @var string
     * @OGM\Property
     * @OGM\Index
     */
    private $title;

    /**
     * @var ArrayCollection
     * @OGM\ManyToMany(relation="previous")
     */
    private $previousVersions;

    /**
     * @var string
     * @OGM\Property
     */
    private $content;

    /**
     * @var int
     * @OGM\Property
     * @OGM\Index
     */
    private $countReaders;

    /**
     * @var VillageInterface
     * @OGM\ManyToOne(relation="has_copy_of",direction="to")
     */
    private $village;
    

    public function __construct(){
        $this->previousVersions = new ArrayCollection();
    }

    public function getId(){
        return $this->id;
    }

    /**
     * @return string
     *
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @return BookInterface[]
     * (0..2)
     */
    public function getPreviousVersions()
    {
        return $this->previousVersions;
    }

    /**
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * @return int
     */
    public function getCountReaders()
    {
        return $this->countReaders;
    }

    /**
     * @return VillageInterface|null
     */
    public function getVillage()
    {
        return $this->village;
    }

    /**
     * @param mixed $id
     * @return Book
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @param mixed $title
     * @return Book
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * @param BookInterface $previousVersion
     * @return Book
     */
    public function addPreviousVersion(BookInterface $previousVersion)
    {
        $this->previousVersions->add($previousVersion);
        return $this;
    }

    /**
     * @param string $textContent
     * @return Book
     */
    public function setContent($textContent)
    {
        $this->content = $textContent;
        return $this;
    }

    /**
     * @param int $countReaders
     * @return Book
     */
    public function setCountReaders($countReaders)
    {
        $this->countReaders = $countReaders;
        return $this;
    }

    /**
     * @param VillageInterface $village
     * @return Book
     */
    public function setVillage($village)
    {
        $this->village = $village;
        return $this;

    }

    /**
     * @return Book
     */
    public static function create(){
        return new Book();
    }

}